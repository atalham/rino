import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types/navigation";
import { theme } from "../../theme";
import { Button } from "../../../components/ui/Button";

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // TODO: Implement login logic
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={isLoading}
          fullWidth
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Button
            title="Sign Up"
            variant="ghost"
            onPress={() => navigation.navigate("UserType")}
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
    padding: theme.spacing.lg,
  } as ViewStyle,
  header: {
    marginTop: theme.spacing.xl * 2,
    marginBottom: theme.spacing.xl,
    alignItems: "center",
  } as ViewStyle,
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  } as TextStyle,
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    color: theme.colors.text.secondary,
  } as TextStyle,
  form: {
    flex: 1,
    gap: theme.spacing.md,
  } as ViewStyle,
  inputContainer: {
    gap: theme.spacing.xs,
  } as ViewStyle,
  label: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600" as const,
    color: theme.colors.text.primary,
  } as TextStyle,
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as TextStyle,
  forgotPassword: {
    alignSelf: "flex-end",
  } as ViewStyle,
  forgotPasswordText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primary,
  } as TextStyle,
  footer: {
    marginTop: theme.spacing.xl,
    alignItems: "center",
  } as ViewStyle,
  footerText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  } as TextStyle,
});
