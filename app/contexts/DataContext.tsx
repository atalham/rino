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
  addDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "./AuthContext";

export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  reward: number;
  status: "idle" | "ongoing" | "pending_approval" | "completed" | "approved";
  dueDate?: Date;
  assignedTo?: string;
  parentId: string;
  requiresProof?: boolean;
  createdAt: Date;
  updatedAt: Date;
  submission?: {
    text?: string;
    imageUrl?: string;
    submittedAt: Date;
  };
  steps?: {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
  }[];
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  isActive: boolean;
  parentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Child {
  id: string;
  name: string;
  parentId: string;
  deviceId?: string;
  lastPairedAt?: Date;
  avatarUrl?: string;
  points: number;
  completedTasks: number;
  redeemedRewards: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DataContextType {
  tasks: Task[];
  rewards: Reward[];
  parent: Parent | null;
  children: Child[];
  childProfile: Child | null;
  parentProfile: Parent | null;
  childPoints: number;
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
  createChildProfile: (name: string) => Promise<Child>;
  getTask: (id: string) => Task | undefined;
  getReward: (id: string) => Reward | undefined;
  createTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  createReward: (
    reward: Omit<Reward, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  submitTask: (taskId: string, proofImage?: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({
  children: providerChildren,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [parent, setParent] = useState<Parent | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setRewards([]);
      setParent(null);
      setChildren([]);
      setIsLoading(false);
      return;
    }

    let tasksUnsubscribe: () => void;
    let rewardsUnsubscribe: () => void;
    let childrenUnsubscribe: () => void;

    const loadParentData = async () => {
      try {
        const parentId = user.userType === "parent" ? user.uid : user.parentId;
        if (!parentId) {
          console.error("No parent ID available");
          setIsLoading(false);
          return;
        }

        const parentDoc = await getDoc(doc(db, "parents", parentId));
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
      }
    };

    if (user.userType === "parent") {
      const tasksQuery = query(
        collection(db, "tasks"),
        where("parentId", "==", user.uid)
      );
      tasksUnsubscribe = onSnapshot(tasksQuery, (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Task[];
        setTasks(tasksData);
      });

      const rewardsQuery = query(
        collection(db, "rewards"),
        where("parentId", "==", user.uid)
      );
      rewardsUnsubscribe = onSnapshot(rewardsQuery, (snapshot) => {
        const rewardsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Reward[];
        setRewards(rewardsData);
      });

      const childrenQuery = query(
        collection(db, "childProfiles"),
        where("parentId", "==", user.uid)
      );
      childrenUnsubscribe = onSnapshot(childrenQuery, (snapshot) => {
        const childrenData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
          lastPairedAt: doc.data().lastPairedAt?.toDate(),
        })) as Child[];
        setChildren(childrenData);
      });
    } else if (user.userType === "child") {
      const tasksQuery = query(
        collection(db, "tasks"),
        where("assignedTo", "==", user.uid)
      );
      tasksUnsubscribe = onSnapshot(tasksQuery, (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Task[];
        setTasks(tasksData);
      });

      if (user.parentId) {
        const rewardsQuery = query(
          collection(db, "rewards"),
          where("parentId", "==", user.parentId)
        );
        rewardsUnsubscribe = onSnapshot(rewardsQuery, (snapshot) => {
          const rewardsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
          })) as Reward[];
          setRewards(rewardsData);
        });
      }
    }

    loadParentData().finally(() => {
      setIsLoading(false);
    });

    return () => {
      tasksUnsubscribe?.();
      rewardsUnsubscribe?.();
      childrenUnsubscribe?.();
    };
  }, [user]);

  const addTask = async (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user || user.userType !== "parent") {
      throw new Error("Only parents can create tasks");
    }

    const newTask: Omit<Task, "id"> = {
      ...task,
      parentId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = doc(collection(db, "tasks"));
    await setDoc(docRef, newTask);
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    if (!user) return;

    const taskRef = doc(db, "tasks", id);
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      throw new Error("Task not found");
    }

    const taskData = taskDoc.data() as Task;

    if (user.userType === "child" && taskData.assignedTo !== user.uid) {
      throw new Error("Not authorized to update this task");
    }

    await updateDoc(taskRef, {
      ...task,
      updatedAt: new Date(),
    });
  };

  const deleteTask = async (id: string) => {
    if (!user || user.userType !== "parent") {
      throw new Error("Only parents can delete tasks");
    }

    const taskRef = doc(db, "tasks", id);
    await deleteDoc(taskRef);
  };

  const completeTask = async (id: string) => {
    if (!user) return;

    const taskRef = doc(db, "tasks", id);
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      throw new Error("Task not found");
    }

    const taskData = taskDoc.data() as Task;

    if (user.userType === "child" && taskData.assignedTo !== user.uid) {
      throw new Error("Not authorized to complete this task");
    }

    await updateDoc(taskRef, {
      isCompleted: true,
      updatedAt: new Date(),
    });
  };

  const addReward = async (
    reward: Omit<Reward, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user || user.userType !== "parent") {
      throw new Error("Only parents can create rewards");
    }

    const newReward: Omit<Reward, "id"> = {
      ...reward,
      parentId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = doc(collection(db, "rewards"));
    await setDoc(docRef, newReward);
  };

  const updateReward = async (id: string, reward: Partial<Reward>) => {
    if (!user || user.userType !== "parent") {
      throw new Error("Only parents can update rewards");
    }

    const rewardRef = doc(db, "rewards", id);
    await updateDoc(rewardRef, {
      ...reward,
      updatedAt: new Date(),
    });
  };

  const deleteReward = async (id: string) => {
    if (!user || user.userType !== "parent") {
      throw new Error("Only parents can delete rewards");
    }

    const rewardRef = doc(db, "rewards", id);
    await deleteDoc(rewardRef);
  };

  const redeemReward = async (id: string) => {
    if (!user || user.userType !== "child") {
      throw new Error("Only children can redeem rewards");
    }

    const rewardRef = doc(db, "rewards", id);
    const rewardDoc = await getDoc(rewardRef);

    if (!rewardDoc.exists()) {
      throw new Error("Reward not found");
    }

    const rewardData = rewardDoc.data() as Reward;

    if (rewardData.parentId !== user.parentId) {
      throw new Error("Not authorized to redeem this reward");
    }

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
      const newParent: Omit<Parent, "id"> = {
        ...parentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Omit<Parent, "id">;
      await setDoc(parentRef, newParent);
      setParent({ id: user.uid, ...newParent } as Parent);
    } else {
      await updateDoc(parentRef, {
        ...parentData,
        updatedAt: new Date(),
      });
      setParent((prev) =>
        prev ? { ...prev, ...parentData, updatedAt: new Date() } : null
      );
    }
  };

  const createChildProfile = async (name: string): Promise<Child> => {
    if (!user) throw new Error("User not authenticated");

    const newChild: Omit<Child, "id"> = {
      name,
      parentId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      points: 0,
      completedTasks: 0,
      redeemedRewards: 0,
    };

    const docRef = await addDoc(collection(db, "childProfiles"), newChild);
    return {
      id: docRef.id,
      ...newChild,
    };
  };

  const getTask = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  const getReward = (id: string) => {
    return rewards.find((reward) => reward.id === id);
  };

  const createTask = async (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user || user.userType !== "parent") {
      throw new Error("Only parents can create tasks");
    }

    const newTask: Omit<Task, "id"> = {
      ...task,
      parentId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = doc(collection(db, "tasks"));
    await setDoc(docRef, newTask);
  };

  const createReward = async (
    reward: Omit<Reward, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user || user.userType !== "parent") {
      throw new Error("Only parents can create rewards");
    }

    const newReward: Omit<Reward, "id"> = {
      ...reward,
      parentId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = doc(collection(db, "rewards"));
    await setDoc(docRef, newReward);
  };

  const submitTask = async (taskId: string, proofImage?: string) => {
    if (!user || user.userType !== "child") {
      throw new Error("Only children can submit tasks");
    }

    const taskRef = doc(db, "tasks", taskId);
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      throw new Error("Task not found");
    }

    const taskData = taskDoc.data() as Task;
    if (taskData.assignedTo !== user.uid) {
      throw new Error("Not authorized to submit this task");
    }

    await updateDoc(taskRef, {
      status: "pending_approval",
      submission: {
        imageUrl: proofImage,
        submittedAt: new Date(),
      },
      updatedAt: new Date(),
    });
  };

  const value = {
    tasks,
    rewards,
    parent,
    children,
    childProfile:
      user?.userType === "child"
        ? children.find((c) => c.id === user.uid) || null
        : null,
    parentProfile: user?.userType === "parent" ? parent : null,
    childPoints:
      user?.userType === "child"
        ? children.find((c) => c.id === user.uid)?.points || 0
        : 0,
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
    createChildProfile,
    getTask,
    getReward,
    createTask,
    createReward,
    submitTask,
  };

  return (
    <DataContext.Provider value={value}>
      {providerChildren}
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
