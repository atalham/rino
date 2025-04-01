import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ViewStyle,
  TextStyle,
  Alert,
  Switch,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { theme } from "../../theme";
import { Button } from "../../../components/ui/Button";
import { useData } from "../../contexts/DataContext";
import { LoadingScreen } from "../../components/ui/LoadingScreen";
import { Reward } from "../../contexts/DataContext";

export default function RewardFormScreen() {
  const router = useRouter();
  const { rewardId } = useLocalSearchParams<{ rewardId?: string }>();
  const { rewards, addReward, updateReward, isLoading } = useData();
  const [formData, setFormData] = useState<Partial<Reward>>({
    title: "",
    description: "",
    cost: 0,
    isActive: true,
  });

  useEffect(() => {
    if (rewardId) {
      const reward = rewards.find((r) => r.id === rewardId);
      if (reward) {
        setFormData(reward);
      }
    }
  }, [rewardId, rewards]);

  const handleSubmit = async () => {
    const title = formData.title?.trim() || "";
    const description = formData.description?.trim() || "";
    const cost = formData.cost || 0;

    if (!title) {
      Alert.alert("Error", "Please enter a reward title");
      return;
    }

    if (!description) {
      Alert.alert("Error", "Please enter a reward description");
      return;
    }

    if (cost <= 0) {
      Alert.alert("Error", "Please enter a valid cost amount");
      return;
    }

    try {
      if (rewardId) {
        await updateReward(rewardId, {
          ...formData,
          title,
          description,
          cost,
        } as Reward);
      } else {
        await addReward({
          ...formData,
          title,
          description,
          cost,
        } as Reward);
      }
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to save reward. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {rewardId ? "Edit Reward" : "Create New Reward"}
        </Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Enter reward title"
              placeholderTextColor={theme.colors.text.secondary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              placeholder="Enter reward description"
              placeholderTextColor={theme.colors.text.secondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Cost (coins)</Text>
            <TextInput
              style={styles.input}
              value={formData.cost?.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, cost: parseInt(text) || 0 })
              }
              placeholder="Enter cost amount"
              placeholderTextColor={theme.colors.text.secondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.field}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Active</Text>
              <Switch
                value={formData.isActive}
                onValueChange={(value) =>
                  setFormData({ ...formData, isActive: value })
                }
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor={theme.colors.surface}
              />
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="secondary"
            fullWidth
          />
          <Button
            title={rewardId ? "Save Changes" : "Create Reward"}
            onPress={handleSubmit}
            fullWidth
          />
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
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
  } as TextStyle,
  form: {
    gap: theme.spacing.lg,
  } as ViewStyle,
  field: {
    gap: theme.spacing.xs,
  } as ViewStyle,
  label: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
  } as TextStyle,
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  actions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  } as ViewStyle,
});
