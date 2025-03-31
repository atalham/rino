import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { theme } from "../../theme";
import { Button } from "../../../components/ui/Button";
import { TaskCard } from "../../../components/TaskCard";

// Temporary mock data
const mockTasks = [
  {
    id: "1",
    title: "Clean Room",
    description: "Make bed, vacuum, and organize toys",
    reward: 50,
    isCompleted: false,
    assignedTo: "Child 1",
  },
  {
    id: "2",
    title: "Do Homework",
    description: "Complete math worksheet and reading assignment",
    reward: 75,
    isCompleted: true,
    assignedTo: "Child 1",
  },
];

export default function ParentTasksScreen() {
  const [tasks, setTasks] = useState(mockTasks);

  const handleTaskPress = (taskId: string) => {
    // TODO: Navigate to task details
  };

  const handleCreateTask = () => {
    // TODO: Navigate to create task screen
  };

  const renderTask = ({ item }: { item: (typeof mockTasks)[0] }) => (
    <TaskCard
      title={item.title}
      description={item.description}
      reward={item.reward}
      isCompleted={item.isCompleted}
      onPress={() => handleTaskPress(item.id)}
      onComplete={() => {
        // TODO: Implement task completion
      }}
      isChildView={false}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <Text style={styles.subtitle}>
          Manage and assign tasks to your children
        </Text>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <Button title="Create New Task" onPress={handleCreateTask} fullWidth />
      </View>
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
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    color: theme.colors.text.secondary,
  } as TextStyle,
  list: {
    padding: theme.spacing.lg,
  } as ViewStyle,
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  } as ViewStyle,
});
