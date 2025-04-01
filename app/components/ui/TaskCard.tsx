import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { theme } from "../../../app/theme";
import { Task } from "../../../app/contexts/DataContext";

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onDelete?: () => void;
}

export function TaskCard({ task, onPress, onDelete }: TaskCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.reward}>🪙 {task.reward}</Text>
        </View>

        <Text style={styles.description}>{task.description}</Text>

        <View style={styles.footer}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: task.isCompleted
                    ? theme.colors.success
                    : theme.colors.warning,
                },
              ]}
            />
            <Text style={styles.statusText}>
              {task.isCompleted ? "Completed" : "Pending"}
            </Text>
          </View>

          {task.assignedTo && (
            <Text style={styles.assignedTo}>
              Assigned to: {task.assignedTo}
            </Text>
          )}
        </View>
      </View>

      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    ...theme.shadows.sm,
  } as ViewStyle,
  content: {
    flex: 1,
    gap: theme.spacing.xs,
  } as ViewStyle,
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  title: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text.primary,
  } as TextStyle,
  reward: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    color: theme.colors.secondary,
  } as TextStyle,
  description: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.xs,
  } as ViewStyle,
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  } as ViewStyle,
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  } as ViewStyle,
  statusText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
  assignedTo: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
  deleteButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  } as ViewStyle,
  deleteText: {
    fontSize: 20,
  } as TextStyle,
});
