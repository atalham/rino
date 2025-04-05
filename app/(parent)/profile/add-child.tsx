import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ViewStyle,
  TextStyle,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { theme } from "../../theme";
import { Button } from "../../../components/ui/Button";
import { useData } from "../../contexts/DataContext";

export default function AddChildScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addChild } = useData();

  const handleAddChild = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const inviteCode = await addChild({
        name: name.trim(),
        email: email.trim(),
      });
      Alert.alert(
        "Success",
        `Child account created! Share this code with your child: ${inviteCode}`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Child</Text>
          <Text style={styles.subtitle}>
            Create an account for your child to start assigning tasks
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Child's Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Child's Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.actions}>
            <Button
              title="Create Child Account"
              onPress={handleAddChild}
              loading={isLoading}
              fullWidth
            />
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="secondary"
              fullWidth
            />
          </View>
        </View>
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
  actions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  } as ViewStyle,
});
