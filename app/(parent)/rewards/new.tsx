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

export default function NewRewardScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pointsCost, setPointsCost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createReward } = useData();

  const handleCreate = async () => {
    if (!title || !description || !pointsCost) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      await createReward({
        title,
        description,
        cost: parseInt(pointsCost, 10),
        isActive: true,
      });
      router.back();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to create reward"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Reward</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Reward Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={
              [
                styles.input,
                { height: 100, textAlignVertical: "top" },
              ] as TextStyle
            }
            placeholder="Reward Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
          <TextInput
            style={styles.input}
            placeholder="Points Cost"
            value={pointsCost}
            onChangeText={setPointsCost}
            keyboardType="numeric"
          />
          <View style={styles.actions}>
            <Button
              title="Create Reward"
              onPress={handleCreate}
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
  } as TextStyle,
  form: {
    gap: theme.spacing.md,
  } as ViewStyle,
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
  } as TextStyle,
  actions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  } as ViewStyle,
});
