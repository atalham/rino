import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "./AuthContext";

export interface Child {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  linkedCode?: string;
  linkedCodeExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ChildContextType {
  children: Child[];
  isLoading: boolean;
  addChild: (
    child: Omit<Child, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateChild: (id: string, child: Partial<Child>) => Promise<void>;
  deleteChild: (id: string) => Promise<void>;
  generateLinkCode: (childId: string) => Promise<string>;
  linkChildProfile: (code: string) => Promise<Child>;
  updatePoints: (childId: string, points: number) => Promise<void>;
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export function ChildProvider({
  childrenElements,
}: {
  childrenElements: React.ReactNode;
}) {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.userType !== "parent") {
      setChildren([]);
      setIsLoading(false);
      return;
    }

    // Subscribe to children collection
    const childrenQuery = query(
      collection(db, "parents", user.uid, "children")
    );
    const unsubscribe = onSnapshot(childrenQuery, (snapshot) => {
      const childrenData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        linkedCodeExpiresAt: doc.data().linkedCodeExpiresAt?.toDate(),
      })) as Child[];
      setChildren(childrenData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addChild = async (
    child: Omit<Child, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user || user.userType !== "parent") return;

    const newChild: Omit<Child, "id"> = {
      ...child,
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = doc(collection(db, "parents", user.uid, "children"));
    await setDoc(docRef, newChild);
  };

  const updateChild = async (id: string, child: Partial<Child>) => {
    if (!user || user.userType !== "parent") return;

    const childRef = doc(db, "parents", user.uid, "children", id);
    await updateDoc(childRef, {
      ...child,
      updatedAt: new Date(),
    });
  };

  const deleteChild = async (id: string) => {
    if (!user || user.userType !== "parent") return;

    const childRef = doc(db, "parents", user.uid, "children", id);
    await deleteDoc(childRef);
  };

  const generateLinkCode = async (childId: string): Promise<string> => {
    if (!user || user.userType !== "parent") return "";

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Code expires in 24 hours

    const childRef = doc(db, "parents", user.uid, "children", childId);
    await updateDoc(childRef, {
      linkedCode: code,
      linkedCodeExpiresAt: Timestamp.fromDate(expiresAt),
      updatedAt: new Date(),
    });

    return code;
  };

  const linkChildProfile = async (code: string): Promise<Child> => {
    if (!user || user.userType !== "child") {
      throw new Error("Only child users can link profiles");
    }

    // Find the child profile with this code
    const childrenQuery = query(
      collection(db, "parents"),
      where("children.linkedCode", "==", code)
    );

    const snapshot = await getDocs(childrenQuery);
    if (snapshot.empty) {
      throw new Error("Invalid or expired link code");
    }

    const parentDoc = snapshot.docs[0];
    const childrenSnapshot = await getDocs(
      collection(db, "parents", parentDoc.id, "children")
    );

    const childDoc = childrenSnapshot.docs.find(
      (doc) => doc.data().linkedCode === code
    );

    if (!childDoc) {
      throw new Error("Child profile not found");
    }

    const childData = childDoc.data();
    if (
      childData.linkedCodeExpiresAt?.toDate() &&
      childData.linkedCodeExpiresAt.toDate() < new Date()
    ) {
      throw new Error("Link code has expired");
    }

    // Update the child profile to link it with the current user
    await updateDoc(childDoc.ref, {
      linkedCode: null,
      linkedCodeExpiresAt: null,
      updatedAt: new Date(),
    });

    return {
      id: childDoc.id,
      ...childData,
      createdAt: childData.createdAt?.toDate(),
      updatedAt: childData.updatedAt?.toDate(),
      linkedCodeExpiresAt: childData.linkedCodeExpiresAt?.toDate(),
    } as Child;
  };

  const updatePoints = async (childId: string, points: number) => {
    if (!user || user.userType !== "parent") return;

    const childRef = doc(db, "parents", user.uid, "children", childId);
    await updateDoc(childRef, {
      points,
      updatedAt: new Date(),
    });
  };

  return (
    <ChildContext.Provider
      value={{
        children,
        isLoading,
        addChild,
        updateChild,
        deleteChild,
        generateLinkCode,
        linkChildProfile,
        updatePoints,
      }}
    >
      {childrenElements}
    </ChildContext.Provider>
  );
}

export function useChild() {
  const context = useContext(ChildContext);
  if (context === undefined) {
    throw new Error("useChild must be used within a ChildProvider");
  }
  return context;
}
