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
  TouchableOpacity,
  Image,
  ImageStyle,
} from "react-native";
import { useRouter } from "expo-router";
import { theme } from "../../theme";
import { Button } from "../../../components/ui/Button";
import { useData } from "../../contexts/DataContext";
import { LoadingScreen } from "../../components/ui/LoadingScreen";
import { Parent } from "../../contexts/DataContext";

export default function ParentProfileFormScreen() {
  const router = useRouter();
  const { parent, updateParent, isLoading } = useData();
  const [formData, setFormData] = useState<Partial<Parent>>({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    if (parent) {
      setFormData(parent);
    }
  }, [parent]);

  const handleSubmit = async () => {
    const name = formData.name?.trim() || "";
    const email = formData.email?.trim() || "";
    const phone = formData.phone?.trim() || "";

    if (!name) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    if (!phone) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    try {
      await updateParent({
        ...formData,
        name,
        email,
        phone,
      } as Parent);
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Edit Profile</Text>

        <View style={styles.avatarContainer}>
          <Image
            source={
              formData.avatar
                ? { uri: formData.avatar }
                : require("../../../assets/default-avatar.png")
            }
            style={styles.avatar as ImageStyle}
          />
          <TouchableOpacity style={styles.changeAvatarButton}>
            <Text style={styles.changeAvatarText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter your full name"
              placeholderTextColor={theme.colors.text.secondary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.text.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter your phone number"
              placeholderTextColor={theme.colors.text.secondary}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="secondary"
            fullWidth
          />
          <Button title="Save Changes" onPress={handleSubmit} fullWidth />
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  } as ViewStyle,
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
  } as ImageStyle,
  changeAvatarButton: {
    padding: theme.spacing.sm,
  } as ViewStyle,
  changeAvatarText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primary,
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
  actions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  } as ViewStyle,
});
