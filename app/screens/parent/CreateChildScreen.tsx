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
  TouchableOpacity,
} from "react-native";
import { theme } from "../../theme";
import { Button } from "../../../components/ui/Button";
import { useData } from "../../contexts/DataContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { useAuth } from "../../contexts/AuthContext";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ProfileForm">;
};

export default function CreateChildScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { createChildProfile } = useAuth();

  const handleCreateChild = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a name for your child");
      return;
    }

    try {
      setIsCreating(true);
      const childProfile = await createChildProfile(name.trim());

      Alert.alert(
        "Child Profile Created",
        `Your child's pairing code is: ${childProfile.pairingCode}\n\nShare this code with your child to pair their device.`,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("ProfileForm"),
          },
        ]
      );
    } catch (error) {
      console.error("Error creating child profile:", error);
      Alert.alert("Error", "Failed to create child profile. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Child Profile</Text>
          <Text style={styles.subtitle}>
            Enter your child's name to create their profile
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Child's Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your child's name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isCreating && styles.buttonDisabled]}
            onPress={handleCreateChild}
            disabled={isCreating}
          >
            <Text style={styles.buttonText}>
              {isCreating ? "Creating..." : "Create Profile"}
            </Text>
          </TouchableOpacity>
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
  } as ViewStyle,
  inputContainer: {
    gap: theme.spacing.xs,
  } as ViewStyle,
  label: {
    fontSize: theme.typography.body.fontSize,
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
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  } as ViewStyle,
  buttonDisabled: {
    backgroundColor: "#999",
  } as ViewStyle,
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  } as TextStyle,
});
