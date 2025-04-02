import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
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
  getDeviceId: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEVICE_ID_KEY = "@rino_device_id";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getDeviceId = async (): Promise<string> => {
    try {
      let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
      if (!deviceId) {
        // Generate a unique device ID using timestamp and random string
        deviceId = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 15)}`;
        await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
      }
      return deviceId;
    } catch (error) {
      console.error("Error getting device ID:", error);
      throw error;
    }
  };

  const generatePairingCode = () => {
    // Generate a 6-character code using uppercase letters and numbers
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

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
            } else {
              await firebaseSignOut(auth);
              setUser(null);
            }
          }
        } else {
          setUser(null);
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

      // Step 1: Sign in anonymously first
      const anonymousUserCredential = await signInAnonymously(auth);
      console.log("anonymousUserCredential", anonymousUserCredential);
      const deviceId = anonymousUserCredential.user.uid;
      console.log("deviceId", deviceId);
      // Step 2: Find child profile by pairing code
      const childrenQuery = query(
        collection(db, "childProfiles"),
        where("pairingCode", "==", pairingCode),
        limit(1)
      );
      console.log("childrenQuery", childrenQuery);
      const childDocs = await getDocs(childrenQuery);
      if (childDocs.empty) {
        await firebaseSignOut(auth);
        throw new Error("Invalid pairing code");
      }
      console.log("childDocs", childDocs);
      const childDoc = childDocs.docs[0];
      const childData = childDoc.data() as ChildProfile;
      console.log("childData", childData);
      // Step 3: Check if device is already paired with another profile
      const deviceQuery = query(
        collection(db, "childProfiles"),
        where("deviceId", "==", deviceId),
        limit(1)
      );
      console.log("deviceQuery", deviceQuery);
      const deviceDocs = await getDocs(deviceQuery);
      console.log("deviceDocs", deviceDocs);
      if (!deviceDocs.empty) {
        console.log("deviceDocs not empty");
        await firebaseSignOut(auth);
        throw new Error("This device is already paired with another profile");
      }
      console.log("deviceDocs empty");
      // Step 4: Update the child profile with device info
      try {
        console.log("update23");
        const childDocRef = doc(db, "childProfiles", childDoc.id);
        console.log("childDocRef", childDocRef.id);
        await setDoc(
          childDocRef,
          {
            deviceId,
            lastPairedAt: serverTimestamp(),
            pairingCode: null,
          },
          { merge: true }
        );
        console.log("update");
      } catch (error) {
        console.log("Error updating child profile:", error);
      }
      console.log("updatedChildDoc");
      // Step 5: Set the user state with the updated data
      const updatedUserData = {
        ...childData,
        deviceId,
        lastPairedAt: new Date(),
      };
      console.log("updatedUserData1", updatedUserData);
      // Step 6: Wait for auth state to update
      await new Promise<void>((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            setUser(updatedUserData);
            unsubscribe();
            resolve();
          }
        });
      });
      console.log("updatedUserData2", updatedUserData);
    } catch (error) {
      console.error("Error pairing child profile:", error);
      await firebaseSignOut(auth);
      throw error;
    } finally {
      console.log("finally");
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await firebaseSignOut(auth);
      setUser(null);
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
    getDeviceId,
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
