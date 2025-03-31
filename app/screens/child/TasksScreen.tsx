import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ViewStyle,
  TextStyle,
} from "react-native";
import { theme } from "../../theme";
import { TaskCard } from "../../../components/TaskCard";

// Temporary mock data
const mockTasks = [
  {
    id: "1",
    title: "Clean Room",
    description: "Make bed, vacuum, and organize toys",
    reward: 50,
    isCompleted: false,
    dueDate: "2024-03-31",
  },
  {
    id: "2",
    title: "Do Homework",
    description: "Complete math worksheet and reading assignment",
    reward: 75,
    isCompleted: true,
    dueDate: "2024-03-30",
  },
  {
    id: "3",
    title: "Practice Piano",
    description: "Practice for 30 minutes",
    reward: 40,
    isCompleted: false,
    dueDate: "2024-03-31",
  },
];

export default function ChildTasksScreen() {
  const [tasks, setTasks] = useState(mockTasks);

  const handleTaskPress = (taskId: string) => {
    // TODO: Navigate to task details
  };

  const handleTaskComplete = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: true } : task
      )
    );
    // TODO: Implement task completion logic
  };

  const renderTask = ({ item }: { item: (typeof mockTasks)[0] }) => (
    <TaskCard
      title={item.title}
      description={item.description}
      reward={item.reward}
      isCompleted={item.isCompleted}
      onPress={() => handleTaskPress(item.id)}
      onComplete={() => handleTaskComplete(item.id)}
      isChildView={true}
    />
  );

  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const totalTasks = tasks.length;
  const progress = (completedTasks / totalTasks) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {completedTasks} of {totalTasks} tasks completed
          </Text>
        </View>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as ViewStyle,
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  } as TextStyle,
  progressContainer: {
    gap: theme.spacing.xs,
  } as ViewStyle,
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.full,
    overflow: "hidden",
  } as ViewStyle,
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  } as ViewStyle,
  progressText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
  list: {
    padding: theme.spacing.lg,
  } as ViewStyle,
});
