import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { theme } from "../../app/theme";
import { Reward } from "../../contexts/DataContext";

export interface RewardCardProps {
  reward: Reward;
  onPress?: () => void;
  isAffordable?: boolean;
}

export function RewardCard({
  reward,
  onPress,
  isAffordable = true,
}: RewardCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, !isAffordable && styles.unaffordable]}>
        <View>
          <Text style={styles.title}>{reward.title}</Text>
          <Text style={styles.description}>{reward.description}</Text>
        </View>
        <Text style={styles.cost}>{reward.cost} points</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as ViewStyle,
  unaffordable: {
    opacity: 0.5,
  } as ViewStyle,
  title: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  description: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
  cost: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.primary,
  } as TextStyle,
});
