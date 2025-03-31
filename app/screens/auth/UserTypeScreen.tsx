import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types/navigation";
import { theme } from "../../theme";
import { Button } from "../../../components/ui/Button";

type UserTypeScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "UserType">;
};

export default function UserTypeScreen({ navigation }: UserTypeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Rino</Text>
        <Text style={styles.subtitle}>Choose your account type</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() =>
            navigation.navigate("Register", { userType: "parent" as const })
          }
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>👨‍👩‍👧‍👦</Text>
          </View>
          <Text style={styles.optionTitle}>Parent</Text>
          <Text style={styles.optionDescription}>
            Create and manage tasks, set up rewards, and track your child's
            progress
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() =>
            navigation.navigate("Register", { userType: "child" as const })
          }
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>👶</Text>
          </View>
          <Text style={styles.optionTitle}>Child</Text>
          <Text style={styles.optionDescription}>
            Complete tasks, earn coins, and redeem rewards
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Button
          title="Login"
          variant="ghost"
          onPress={() => navigation.navigate("Login")}
        />
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
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
    gap: theme.spacing.lg,
  } as ViewStyle,
  optionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  } as ViewStyle,
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  icon: {
    fontSize: 32,
  } as TextStyle,
  optionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  } as TextStyle,
  optionDescription: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    color: theme.colors.text.secondary,
  } as TextStyle,
  footer: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  } as ViewStyle,
  footerText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  } as TextStyle,
});
