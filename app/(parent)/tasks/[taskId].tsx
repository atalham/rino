import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextStyle,
  ViewStyle,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { theme } from "../../theme";
import { Button } from "../../../components/ui/Button";
import { useData } from "../../contexts/DataContext";
import { LoadingScreen } from "../../components/ui/LoadingScreen";

export default function TaskDetailsScreen() {
  const { taskId } = useLocalSearchParams();
  const { tasks, deleteTask, isLoading } = useData();
  const task = tasks.find((t) => t.id === taskId);

  if (isLoading || !task) {
    return <LoadingScreen style={{ flex: 1 }} />;
  }

  const handleDelete = async () => {
    try {
      await deleteTask(taskId as string);
      router.back();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to delete task"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.points}>{task.points} points</Text>
        </View>

        <Text style={styles.description}>{task.description}</Text>

        <View style={styles.actions}>
          <Button
            title="Edit Task"
            onPress={() => router.push(`/(parent)/tasks/edit/${taskId}`)}
            fullWidth
          />
          <Button
            title="Delete Task"
            onPress={() => {
              Alert.alert(
                "Delete Task",
                "Are you sure you want to delete this task?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    onPress: handleDelete,
                    style: "destructive",
                  },
                ]
              );
            }}
            variant="secondary"
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,
  content: {
    padding: theme.spacing.lg,
  } as ViewStyle,
  header: {
    marginBottom: theme.spacing.xl,
  } as ViewStyle,
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  points: {
    fontSize: theme.typography.h2.fontSize,
    color: theme.colors.primary,
  } as TextStyle,
  description: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  } as TextStyle,
  actions: {
    gap: theme.spacing.md,
  } as ViewStyle,
});
