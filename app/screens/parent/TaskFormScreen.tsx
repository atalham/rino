import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ViewStyle,
  TextStyle,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { theme } from "../../theme";
import { Button } from "../../../components/ui/Button";
import { useData } from "../../contexts/DataContext";
import { LoadingScreen } from "../../components/ui/LoadingScreen";
import { Task } from "../../contexts/DataContext";

export default function TaskFormScreen() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams<{ taskId?: string }>();
  const { tasks, addTask, updateTask, isLoading } = useData();
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    reward: 0,
    assignedTo: "",
    dueDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (taskId) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setFormData({
          ...task,
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        });
      }
    }
  }, [taskId, tasks]);

  const handleSubmit = async () => {
    const title = formData.title?.trim() || "";
    const description = formData.description?.trim() || "";
    const reward = formData.reward || 0;

    if (!title) {
      Alert.alert("Error", "Please enter a task title");
      return;
    }

    if (!description) {
      Alert.alert("Error", "Please enter a task description");
      return;
    }

    if (reward <= 0) {
      Alert.alert("Error", "Please enter a valid reward amount");
      return;
    }

    try {
      if (taskId) {
        await updateTask(taskId, {
          ...formData,
          title,
          description,
          reward,
        } as Task);
      } else {
        await addTask({
          ...formData,
          title,
          description,
          reward,
        } as Task);
      }
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to save task. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {taskId ? "Edit Task" : "Create New Task"}
        </Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Enter task title"
              placeholderTextColor={theme.colors.text.secondary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              placeholder="Enter task description"
              placeholderTextColor={theme.colors.text.secondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Reward (coins)</Text>
            <TextInput
              style={styles.input}
              value={formData.reward?.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, reward: parseInt(text) || 0 })
              }
              placeholder="Enter reward amount"
              placeholderTextColor={theme.colors.text.secondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Assign to</Text>
            <TextInput
              style={styles.input}
              value={formData.assignedTo}
              onChangeText={(text) =>
                setFormData({ ...formData, assignedTo: text })
              }
              placeholder="Enter child's name"
              placeholderTextColor={theme.colors.text.secondary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Due Date</Text>
            <TextInput
              style={styles.input}
              value={formData.dueDate}
              onChangeText={(text) =>
                setFormData({ ...formData, dueDate: text })
              }
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.colors.text.secondary}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="secondary"
            fullWidth
          />
          <Button
            title={taskId ? "Save Changes" : "Create Task"}
            onPress={handleSubmit}
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
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
  } as TextStyle,
  form: {
    gap: theme.spacing.lg,
  } as ViewStyle,
  field: {
    gap: theme.spacing.xs,
  } as ViewStyle,
  label: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    color: theme.colors.text.primary,
  } as TextStyle,
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as TextStyle,
  textArea: {
    height: 100,
    textAlignVertical: "top",
  } as TextStyle,
  actions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  } as ViewStyle,
});
