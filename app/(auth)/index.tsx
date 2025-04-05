import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { router } from "expo-router";
import { theme } from "../theme";
import { Button } from "../../components/ui/Button";

export default function UserTypeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Rino</Text>
          <Text style={styles.subtitle}>
            Choose how you want to use the app
          </Text>
        </View>

        <View style={styles.buttons}>
          <Button
            title="I'm a Parent"
            onPress={() => router.push("/(auth)/register?userType=parent")}
            fullWidth
          />
          <Button
            title="I'm a Child"
            onPress={() => router.push("/(auth)/pair-profile")}
            fullWidth
            variant="secondary"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: "center",
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
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
  buttons: {
    gap: theme.spacing.md,
  } as ViewStyle,
});
