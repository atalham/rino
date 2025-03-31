import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card } from "./ui/Card";
import { theme } from "../app/theme";

interface RewardCardProps {
  title: string;
  description: string;
  cost: number;
  onPress: () => void;
  isAffordable: boolean;
}

export const RewardCard: React.FC<RewardCardProps> = ({
  title,
  description,
  cost,
  onPress,
  isAffordable,
}) => {
  return (
    <Card variant="elevated" style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.content, !isAffordable && styles.disabledContent]}
        disabled={!isAffordable}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View
            style={[styles.costContainer, !isAffordable && styles.disabledCost]}
          >
            <Text style={styles.costText}>🪙 {cost}</Text>
          </View>
        </View>

        <Text style={styles.description}>{description}</Text>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={onPress}
            disabled={!isAffordable}
            style={[
              styles.redeemButton,
              !isAffordable && styles.disabledButton,
            ]}
          >
            <Text style={styles.redeemButtonText}>
              {isAffordable ? "Redeem" : "Not Enough Coins"}
            </Text>
          </TouchableOpacity>
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
  disabledContent: {
    opacity: 0.7,
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
  costContainer: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  disabledCost: {
    backgroundColor: theme.colors.text.light,
  },
  costText: {
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
    justifyContent: "flex-end",
  },
  redeemButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  disabledButton: {
    backgroundColor: theme.colors.text.light,
  },
  redeemButtonText: {
    color: "#FFFFFF",
    fontWeight: "600" as const,
  },
});
