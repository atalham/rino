import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  ViewStyle,
  TextStyle,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { theme } from "../../theme";
import { Button } from "../../../components/ui/Button";
import { useData } from "../../contexts/DataContext";
import { LoadingScreen } from "../../components/ui/LoadingScreen";
import * as ImagePicker from "expo-image-picker";

export default function EditProfileScreen() {
  const { parentProfile, updateParentProfile, isLoading } = useData();
  const [name, setName] = useState(parentProfile?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(parentProfile?.avatarUrl || null);
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return <LoadingScreen style={{ flex: 1 }} />;
  }

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera roll permissions to change your avatar."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    try {
      setIsSaving(true);
      await updateParentProfile({
        name: name.trim(),
        avatarUrl,
      });
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.avatarSection}>
            <Image
              source={
                avatarUrl
                  ? { uri: avatarUrl }
                  : require("../../../assets/default-avatar.png")
              }
              style={styles.avatar}
            />
            <Button
              title="Change Avatar"
              onPress={handleImagePick}
              variant="secondary"
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
          />

          <View style={styles.actions}>
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={isSaving}
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
    gap: theme.spacing.lg,
  } as ViewStyle,
  avatarSection: {
    alignItems: "center",
    gap: theme.spacing.md,
  } as ViewStyle,
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
