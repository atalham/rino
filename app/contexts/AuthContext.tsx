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
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

export interface User {
  id: string;
  uid: string;
  email?: string; // Optional since child profiles won't have email
  name: string;
  userType: "parent" | "child";
  parentId?: string; // For child profiles
  pairingCode?: string; // For parent profiles
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  createChildProfile: (name: string) => Promise<string>;
  pairChildProfile: (pairingCode: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

          if (!userDoc.exists()) {
            // If user document doesn't exist, sign out
            await firebaseSignOut(auth);
            setUser(null);
            return;
          }

          const userData = userDoc.data() as User;

          // Only allow parent accounts to be authenticated
          if (userData.userType !== "parent") {
            await firebaseSignOut(auth);
            setUser(null);
            return;
          }

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

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (!userDoc.exists()) {
        // If user document doesn't exist, sign out and throw error
        await firebaseSignOut(auth);
        throw new Error("User data not found");
      }

      const userData = userDoc.data() as User;

      // Only allow parent accounts to sign in through this method
      if (userData.userType !== "parent") {
        await firebaseSignOut(auth);
        throw new Error("Only parent accounts can sign in with email/password");
      }

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
      const pairingCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      // Create user document in Firestore
      const userData: User = {
        id: userCredential.user.uid,
        uid: userCredential.user.uid,
        email,
        name,
        userType: "parent",
        pairingCode,
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userData);
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
      const childRef = doc(collection(db, "users"));
      const childData: User = {
        id: childRef.id,
        uid: childRef.id,
        name,
        userType: "child",
        parentId: user.id,
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
    if (!user || user.userType !== "child") {
      throw new Error("Only child profiles can be paired");
    }

    try {
      setIsLoading(true);
      // Find parent by pairing code
      const parentsQuery = query(
        collection(db, "users"),
        where("pairingCode", "==", pairingCode),
        where("userType", "==", "parent")
      );
      const parentDocs = await getDocs(parentsQuery);

      if (parentDocs.empty) {
        throw new Error("Invalid pairing code");
      }

      const parentDoc = parentDocs.docs[0];
      const parentId = parentDoc.id;

      // Update child profile with parent ID
      const childRef = doc(db, "users", user.id);
      await setDoc(childRef, { parentId }, { merge: true });

      // Update user state
      setUser({ ...user, parentId });
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        createChildProfile,
        pairChildProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
