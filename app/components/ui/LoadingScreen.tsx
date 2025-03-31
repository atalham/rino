import React from "react";
import { View, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../../theme";

interface LoadingScreenProps {
  fullScreen?: boolean;
}

export function LoadingScreen({ fullScreen = false }: LoadingScreenProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
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
  fullScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  } as ViewStyle,
});
