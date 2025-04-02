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
import { useAuth } from "../../contexts/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types/navigation";

type PairProfileScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "PairProfile">;
};

export default function PairProfileScreen({
  navigation,
}: PairProfileScreenProps) {
  const [pairingCode, setPairingCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { pairChildProfile } = useAuth();

  const handlePairProfile = async () => {
    if (!pairingCode.trim()) {
      Alert.alert("Error", "Please enter the pairing code");
      return;
    }

    try {
      setIsLoading(true);
      await pairChildProfile(pairingCode.trim().toUpperCase());
      Alert.alert("Success", "Profile paired successfully!", [
        {
          text: "OK",
          onPress: () => {
            // The AuthContext will handle the navigation through the auth state change
          },
        },
      ]);
    } catch (error: any) {
      console.error("Error pairing profile:", error);
      let errorMessage = "Failed to pair profile. Please try again.";

      if (error.message === "Invalid pairing code") {
        errorMessage = "Invalid pairing code. Please check and try again.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Pair Your Profile</Text>
          <Text style={styles.subtitle}>
            Enter the pairing code from your parent to connect your profile
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Pairing Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter the pairing code"
              value={pairingCode}
              onChangeText={setPairingCode}
              autoCapitalize="characters"
              autoComplete="off"
              autoCorrect={false}
            />
            <Text style={styles.helpText}>
              Ask your parent for the pairing code to connect your profile
            </Text>
          </View>

          <Button
            title="Pair Profile"
            onPress={handlePairProfile}
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
  helpText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  } as TextStyle,
});
