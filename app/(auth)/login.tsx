import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ViewStyle,
  TextStyle,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { theme } from "../theme";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to log in"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            title="Login"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
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
  form: {
    gap: theme.spacing.md,
  } as ViewStyle,
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
  } as TextStyle,
});
