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
import { RouteProp } from "@react-navigation/native";
import { AuthStackParamList } from "../../types/navigation";
import { theme } from "../../theme";
import { Button } from "../../../components/ui/Button";

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Register">;
  route: RouteProp<AuthStackParamList, "Register">;
};

export default function RegisterScreen({
  navigation,
  route,
}: RegisterScreenProps) {
  const { userType } = route.params;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      // TODO: Show error message
      return;
    }

    setIsLoading(true);
    // TODO: Implement registration logic
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          {userType === "parent"
            ? "Set up your parent account"
            : "Set up your child account"}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <Button
          title="Create Account"
          onPress={handleRegister}
          loading={isLoading}
          fullWidth
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Button
            title="Sign In"
            variant="ghost"
            onPress={() => navigation.navigate("Login")}
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
