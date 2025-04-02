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
import { theme } from "../../theme";
import { Button } from "../../../components/ui/Button";
import { useData } from "../../contexts/DataContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

type CreateChildScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CreateChild">;
};

export default function CreateChildScreen({
  navigation,
}: CreateChildScreenProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createChildProfile } = useData();

  const handleCreateChild = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your child's name");
      return;
    }

    try {
      setIsLoading(true);
      const child = await createChildProfile(name.trim());
      Alert.alert(
        "Success",
        "Child profile created! Share the pairing code with your child to connect their profile.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error("Error creating child profile:", error);
      Alert.alert("Error", "Failed to create child profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Child Profile</Text>
          <Text style={styles.subtitle}>
            Add a new child to manage their tasks and rewards
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

          <Button
            title="Create Profile"
            onPress={handleCreateChild}
            loading={isLoading}
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
});
