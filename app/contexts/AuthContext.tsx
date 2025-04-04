import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  uid: string;
  email?: string;
  name: string;
  userType: "parent" | "child";
  parentId?: string;
  deviceId?: string;
  lastPairedAt?: Date;
}

interface ChildProfile extends User {
  pairingCode?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  createChildProfile: (name: string) => Promise<ChildProfile>;
  pairChildProfile: (pairingCode: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    userType: "parent" | "child"
  ) => Promise<void>;
  pairWithParent: (pairCode: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEVICE_ID_KEY = "@rino_device_id";
const CHILD_PROFILE_KEY = "@rino_child_profile";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const generatePairingCode = () => {
    // Generate a 6-character code using uppercase letters and numbers
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Load child profile from storage on app start
  useEffect(() => {
    const loadChildProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem(CHILD_PROFILE_KEY);
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          setUser(profile);
        }
      } catch (error) {
        console.error("Error loading child profile:", error);
      }
    };

    loadChildProfile();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Check if user is a parent
          const parentDoc = await getDoc(doc(db, "parents", firebaseUser.uid));
          if (parentDoc.exists()) {
            const userData = parentDoc.data() as User;
            setUser(userData);
          } else {
            // Check if user is a child
            const childQuery = query(
              collection(db, "childProfiles"),
              where("deviceId", "==", firebaseUser.uid),
              limit(1)
            );
            const childDocs = await getDocs(childQuery);

            if (!childDocs.empty) {
              const childData = childDocs.docs[0].data() as User;
              setUser(childData);
              // Store child profile locally
              await AsyncStorage.setItem(
                CHILD_PROFILE_KEY,
                JSON.stringify(childData)
              );
            } else {
              setUser(null);
              await AsyncStorage.removeItem(CHILD_PROFILE_KEY);
            }
          }
        } else {
          // When no Firebase user, check for stored child profile
          const storedProfile = await AsyncStorage.getItem(CHILD_PROFILE_KEY);
          if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            setUser(profile);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userDoc = await getDoc(doc(db, "parents", userCredential.user.uid));

      if (!userDoc.exists()) {
        await firebaseSignOut(auth);
        throw new Error("User data not found");
      }

      const userData = userDoc.data() as User;
      setUser(userData);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create parent document in Firestore
      const userData: User = {
        id: userCredential.user.uid,
        uid: userCredential.user.uid,
        email,
        name,
        userType: "parent",
      };

      await setDoc(doc(db, "parents", userCredential.user.uid), userData);
      setUser(userData);
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createChildProfile = async (name: string): Promise<ChildProfile> => {
    if (!user || user.userType !== "parent") {
      throw new Error("Only parents can create child profiles");
    }

    try {
      setIsLoading(true);
      // Create a new child profile document
      const childRef = doc(collection(db, "childProfiles"));
      const pairingCode = generatePairingCode();

      const childData: ChildProfile = {
        id: childRef.id,
        uid: childRef.id,
        name,
        userType: "child",
        parentId: user.id,
        pairingCode,
      };

      await setDoc(childRef, childData);
      return childData;
    } catch (error) {
      console.error("Error creating child profile:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const pairChildProfile = async (pairingCode: string) => {
    try {
      setIsLoading(true);

      // Step 1: Get or generate device ID
      // Step 1: Sign in anonymously first
      const anonymousUserCredential = await signInAnonymously(auth);

      const deviceId = anonymousUserCredential.user.uid;

      // Step 2: Find child profile by pairing code
      const childrenQuery = query(
        collection(db, "childProfiles"),
        where("pairingCode", "==", pairingCode),
        limit(1)
      );

      const childDocs = await getDocs(childrenQuery);
      if (childDocs.empty) {
        throw new Error("Invalid pairing code");
      }

      const childDoc = childDocs.docs[0];
      const childData = childDoc.data() as ChildProfile;

      // Step 3: Check if device is already paired with another profile
      // const deviceQuery = query(
      //   collection(db, "childProfiles"),
      //   where("deviceId", "==", deviceId),
      //   limit(1)
      // );

      // const deviceDocs = await getDocs(deviceQuery);
      // if (!deviceDocs.empty) {
      //   throw new Error("This device is already paired with another profile");
      // }

      // Step 4: Update the child profile with device info
      await updateDoc(childDoc.ref, {
        deviceId,
        lastPairedAt: serverTimestamp(),
        pairingCode: null,
      });

      // Step 5: Set the user state and store locally
      const updatedUserData = {
        ...childData,
        deviceId,
        lastPairedAt: new Date(),
      };
      setUser(updatedUserData);
      await AsyncStorage.setItem(
        CHILD_PROFILE_KEY,
        JSON.stringify(updatedUserData)
      );
    } catch (error) {
      console.error("Error pairing child profile:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    userType: "parent" | "child"
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        userType,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error in register:", error);
      throw error;
    }
  };

  const pairWithParent = async (pairCode: string) => {
    if (!auth.currentUser) {
      throw new Error("Not authenticated");
    }

    try {
      // Find parent by pair code
      const parentQuery = query(
        collection(db, "parents"),
        where("pairCode", "==", pairCode)
      );
      const parentDocs = await getDocs(parentQuery);

      if (parentDocs.empty) {
        throw new Error("Invalid pairing code");
      }

      const parentDoc = parentDocs.docs[0];

      // Update user with parent reference
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        parentId: parentDoc.id,
        updatedAt: new Date(),
      });

      // Update child profile with device info
      await updateDoc(doc(db, "childProfiles", auth.currentUser.uid), {
        deviceId: auth.currentUser.uid,
        lastPairedAt: new Date(),
      });
    } catch (error) {
      console.error("Error in pairWithParent:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await firebaseSignOut(auth);
      setUser(null);
      await AsyncStorage.removeItem(CHILD_PROFILE_KEY);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    createChildProfile,
    pairChildProfile,
    register,
    pairWithParent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
