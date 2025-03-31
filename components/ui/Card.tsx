import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../../app/theme";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  style,
}) => {
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case "elevated":
        return {
          ...theme.shadows.md,
          backgroundColor: theme.colors.surface,
        };
      case "outlined":
        return {
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        };
      default:
        return {
          ...theme.shadows.sm,
          backgroundColor: theme.colors.surface,
        };
    }
  };

  return (
    <View style={[styles.card, getVariantStyles(), style]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
});
