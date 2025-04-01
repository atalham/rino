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
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "./AuthContext";

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  isCompleted: boolean;
  dueDate?: Date;
  assignedTo?: string; // childId
  createdAt: Date;
  updatedAt: Date;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DataContextType {
  tasks: Task[];
  rewards: Reward[];
  parent: Parent | null;
  isLoading: boolean;
  addTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  addReward: (
    reward: Omit<Reward, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateReward: (id: string, reward: Partial<Reward>) => Promise<void>;
  deleteReward: (id: string) => Promise<void>;
  redeemReward: (id: string) => Promise<void>;
  updateParent: (parent: Partial<Parent>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [parent, setParent] = useState<Parent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setRewards([]);
      setParent(null);
      setIsLoading(false);
      return;
    }

    // Subscribe to tasks
    const tasksQuery = query(collection(db, "parents", user.uid, "tasks"));
    const tasksUnsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Task[];
      setTasks(tasksData);
    });

    // Subscribe to rewards
    const rewardsQuery = query(collection(db, "parents", user.uid, "rewards"));
    const rewardsUnsubscribe = onSnapshot(rewardsQuery, (snapshot) => {
      const rewardsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Reward[];
      setRewards(rewardsData);
    });

    // Load parent data
    const loadParentData = async () => {
      try {
        const parentDoc = await getDoc(doc(db, "parents", user.uid));
        if (parentDoc.exists()) {
          setParent({
            id: parentDoc.id,
            ...parentDoc.data(),
            createdAt: parentDoc.data().createdAt?.toDate(),
            updatedAt: parentDoc.data().updatedAt?.toDate(),
          } as Parent);
        }
      } catch (error) {
        console.error("Error loading parent data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadParentData();

    return () => {
      tasksUnsubscribe();
      rewardsUnsubscribe();
    };
  }, [user]);

  const addTask = async (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user) return;

    const newTask: Omit<Task, "id"> = {
      ...task,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = doc(collection(db, "parents", user.uid, "tasks"));
    await setDoc(docRef, newTask);
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    if (!user) return;

    const taskRef = doc(db, "parents", user.uid, "tasks", id);
    await updateDoc(taskRef, {
      ...task,
      updatedAt: new Date(),
    });
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    const taskRef = doc(db, "parents", user.uid, "tasks", id);
    await deleteDoc(taskRef);
  };

  const completeTask = async (id: string) => {
    if (!user) return;

    const taskRef = doc(db, "parents", user.uid, "tasks", id);
    await updateDoc(taskRef, {
      isCompleted: true,
      updatedAt: new Date(),
    });
  };

  const addReward = async (
    reward: Omit<Reward, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user) return;

    const newReward: Omit<Reward, "id"> = {
      ...reward,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = doc(collection(db, "parents", user.uid, "rewards"));
    await setDoc(docRef, newReward);
  };

  const updateReward = async (id: string, reward: Partial<Reward>) => {
    if (!user) return;

    const rewardRef = doc(db, "parents", user.uid, "rewards", id);
    await updateDoc(rewardRef, {
      ...reward,
      updatedAt: new Date(),
    });
  };

  const deleteReward = async (id: string) => {
    if (!user) return;

    const rewardRef = doc(db, "parents", user.uid, "rewards", id);
    await deleteDoc(rewardRef);
  };

  const redeemReward = async (id: string) => {
    if (!user) return;

    const rewardRef = doc(db, "parents", user.uid, "rewards", id);
    await updateDoc(rewardRef, {
      isActive: false,
      updatedAt: new Date(),
    });
  };

  const updateParent = async (parentData: Partial<Parent>) => {
    if (!user) return;

    const parentRef = doc(db, "parents", user.uid);
    const parentDoc = await getDoc(parentRef);

    if (!parentDoc.exists()) {
      // Create new parent document
      const newParent: Omit<Parent, "id"> = {
        ...parentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Omit<Parent, "id">;
      await setDoc(parentRef, newParent);
      setParent({ id: user.uid, ...newParent } as Parent);
    } else {
      // Update existing parent document
      await updateDoc(parentRef, {
        ...parentData,
        updatedAt: new Date(),
      });
      setParent((prev) =>
        prev ? { ...prev, ...parentData, updatedAt: new Date() } : null
      );
    }
  };

  return (
    <DataContext.Provider
      value={{
        tasks,
        rewards,
        parent,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        addReward,
        updateReward,
        deleteReward,
        redeemReward,
        updateParent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
