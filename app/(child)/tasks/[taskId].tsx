import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Alert,
  Image,
  Platform,
  ImageStyle,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { theme } from "../../theme";
import { Button } from "../../../components/ui/Button";
import { useData } from "../../contexts/DataContext";
import { LoadingScreen } from "../../components/ui/LoadingScreen";
import * as ImagePicker from "expo-image-picker";

export default function TaskDetailsScreen() {
  const { taskId } = useLocalSearchParams();
  const { getTask, submitTask, isLoading } = useData();
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const task = getTask(taskId as string);

  if (isLoading || !task) {
    return <LoadingScreen style={{ flex: 1 }} />;
  }

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera roll permissions to upload proof."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProofImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!proofImage && task.requiresProof) {
      Alert.alert(
        "Proof Required",
        "Please add a photo as proof of completion."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await submitTask(taskId as string, proofImage || undefined);
      Alert.alert("Success", "Task submitted for approval!");
      router.back();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to submit task"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.points}>{task.points} points</Text>
        </View>

        <Text style={styles.description}>{task.description}</Text>

        {task.requiresProof && (
          <View style={styles.proofSection}>
            <Text style={styles.sectionTitle}>Proof of Completion</Text>
            {proofImage ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: proofImage }}
                  style={styles.proofImage as ImageStyle}
                />
                <Button
                  title="Change Image"
                  onPress={handleImagePick}
                  variant="secondary"
                  fullWidth
                />
              </View>
            ) : (
              <Button
                title="Add Photo"
                onPress={handleImagePick}
                variant="secondary"
                fullWidth
              />
            )}
          </View>
        )}

        <View style={styles.actions}>
          <Button
            title="Submit Task"
            onPress={handleSubmit}
            loading={isSubmitting}
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
  points: {
    fontSize: theme.typography.h2.fontSize,
    color: theme.colors.primary,
  } as TextStyle,
  description: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  } as TextStyle,
  proofSection: {
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  } as ViewStyle,
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text.primary,
  } as TextStyle,
  imageContainer: {
    gap: theme.spacing.md,
  } as ViewStyle,
  proofImage: {
    width: "100%",
    height: 200,
    borderRadius: theme.borderRadius.md,
  } as ImageStyle,
  actions: {
    gap: theme.spacing.md,
  } as ViewStyle,
});
