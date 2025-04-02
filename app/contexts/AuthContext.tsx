import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
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
  pairingCode?: string;
  deviceId?: string;
  lastPairedAt?: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  createChildProfile: (name: string) => Promise<string>;
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
          const userDoc = await getDoc(doc(db, "parents", firebaseUser.uid));

          if (!userDoc.exists()) {
            await firebaseSignOut(auth);
            setUser(null);
            return;
          }

          const userData = userDoc.data() as User;
          setUser(userData);
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

      // Generate a unique pairing code for the parent
      const pairingCode = generatePairingCode();

      // Create parent document in Firestore
      const userData: User = {
        id: userCredential.user.uid,
        uid: userCredential.user.uid,
        email,
        name,
        userType: "parent",
        pairingCode,
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

  const createChildProfile = async (name: string) => {
    if (!user || user.userType !== "parent") {
      throw new Error("Only parents can create child profiles");
    }

    try {
      setIsLoading(true);
      // Create a new child profile document
      const childRef = doc(collection(db, "childProfiles"));
      const pairingCode = generatePairingCode();

      const childData: User = {
        id: childRef.id,
        uid: childRef.id,
        name,
        userType: "child",
        parentId: user.id,
        pairingCode,
      };

      await setDoc(childRef, childData);
      return childRef.id;
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
      const deviceId = await getDeviceId();

      // Find child profile by pairing code
      const childrenQuery = query(
        collection(db, "childProfiles"),
        where("pairingCode", "==", pairingCode)
      );
      const childDocs = await getDocs(childrenQuery);

      if (childDocs.empty) {
        throw new Error("Invalid pairing code");
      }

      const childDoc = childDocs.docs[0];
      const childData = childDoc.data() as User;

      // Check if device is already paired with another profile
      const deviceQuery = query(
        collection(db, "childProfiles"),
        where("deviceId", "==", deviceId)
      );
      const deviceDocs = await getDocs(deviceQuery);

      if (!deviceDocs.empty) {
        throw new Error("This device is already paired with another profile");
      }

      // Update child profile with device ID and pairing timestamp
      await updateDoc(childDoc.ref, {
        deviceId,
        lastPairedAt: serverTimestamp(),
        pairingCode: null, // Clear the pairing code after successful pairing
      });

      setUser(childData);
    } catch (error) {
      console.error("Error pairing child profile:", error);
      throw error;
    } finally {
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
