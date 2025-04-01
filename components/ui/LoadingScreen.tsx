import React from "react";
import { View, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../../app/theme";

interface LoadingScreenProps {
  style?: ViewStyle;
}

export function LoadingScreen({ style }: LoadingScreenProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  } as ViewStyle,
});
