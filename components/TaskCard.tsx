import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card } from "./ui/Card";
import { theme } from "../app/theme";

interface TaskCardProps {
  title: string;
  description: string;
  reward: number;
  isCompleted: boolean;
  onPress: () => void;
  onComplete: () => void;
  isChildView?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  reward,
  isCompleted,
  onPress,
  onComplete,
  isChildView = false,
}) => {
  return (
    <Card variant="elevated" style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.rewardContainer}>
            <Text style={styles.rewardText}>🪙 {reward}</Text>
          </View>
        </View>

        <Text style={styles.description}>{description}</Text>

        <View style={styles.footer}>
          <View
            style={[
              styles.statusContainer,
              isCompleted && styles.completedStatus,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isCompleted && styles.completedStatusText,
              ]}
            >
              {isCompleted ? "Completed" : "Pending"}
            </Text>
          </View>

          {isChildView && !isCompleted && (
            <TouchableOpacity
              onPress={onComplete}
              style={styles.completeButton}
            >
              <Text style={styles.completeButtonText}>Mark Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
  },
  content: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: "600" as const,
    color: theme.colors.text.primary,
    flex: 1,
  },
  rewardContainer: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  rewardText: {
    color: "#FFFFFF",
    fontWeight: "600" as const,
  },
  description: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "normal" as const,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusContainer: {
    backgroundColor: theme.colors.warning + "20",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  completedStatus: {
    backgroundColor: theme.colors.success + "20",
  },
  statusText: {
    color: theme.colors.warning,
    fontWeight: "600" as const,
  },
  completedStatusText: {
    color: theme.colors.success,
  },
  completeButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontWeight: "600" as const,
  },
});
