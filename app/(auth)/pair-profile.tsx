import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ViewStyle,
  TextStyle,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { theme } from "../theme";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";

export default function PairProfileScreen() {
  const [pairCode, setPairCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { pairWithParent } = useAuth();

  const handlePairProfile = async () => {
    try {
      setIsLoading(true);
      await pairWithParent(pairCode);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to pair with parent"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Connect with Parent</Text>
          <Text style={styles.subtitle}>
            Ask your parent for their pairing code and enter it below
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter pairing code"
            value={pairCode}
            onChangeText={setPairCode}
            autoCapitalize="none"
          />
          <Button
            title="Connect"
            onPress={handlePairProfile}
            loading={isLoading}
            fullWidth
          />
        </View>

        <Button
          title="Go back"
          onPress={() => router.back()}
          variant="secondary"
          fullWidth
        />
        <Button
          title="Need to create an account?"
          onPress={() => router.push("/(auth)/register?userType=child")}
          variant="secondary"
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,
  content: {
    padding: theme.spacing.lg,
    flex: 1,
    justifyContent: "center",
    minHeight: "100%",
  } as ViewStyle,
  header: {
    marginTop: theme.spacing.xl,
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
    marginBottom: theme.spacing.xl,
  } as ViewStyle,
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
  } as TextStyle,
});
