import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { theme } from "../../app/theme";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        };
      case "secondary":
        return {
          backgroundColor: theme.colors.secondary,
          borderColor: theme.colors.secondary,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: theme.colors.primary,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          borderColor: "transparent",
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.sm,
        };
      case "md":
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
        };
      case "lg":
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
        };
      default:
        return {};
    }
  };

  const getTextColor = () => {
    if (variant === "outline" || variant === "ghost") {
      return theme.colors.primary;
    }
    return "#FFFFFF";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            { color: getTextColor() },
            size === "sm" && styles.textSm,
            size === "lg" && styles.textLg,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
  },
  textSm: {
    fontSize: theme.typography.caption.fontSize,
  },
  textLg: {
    fontSize: theme.typography.h3.fontSize,
  },
  disabled: {
    opacity: 0.6,
  },
  fullWidth: {
    width: "100%",
  },
});
