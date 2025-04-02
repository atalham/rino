import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ViewStyle,
  TextStyle,
  Alert,
  ImageStyle,
} from "react-native";
import { theme } from "../../theme";
import { Button } from "../../../components/ui/Button";
import { useData } from "../../contexts/DataContext";
import { LoadingScreen } from "../../components/ui/LoadingScreen";
import { useAuth } from "../../contexts/AuthContext";
import { Child } from "../../contexts/DataContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

type ParentProfileScreenProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "ParentMain" | "ProfileForm" | "CreateChild"
  >;
};

export default function ParentProfileScreen({
  navigation,
}: ParentProfileScreenProps) {
  const { signOut } = useAuth();
  const { parent, tasks, rewards, isLoading, children } = useData();

  const handleEditProfile = () => {
    navigation.navigate("ProfileForm");
  };

  const handleCreateChild = () => {
    navigation.navigate("CreateChild");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
    } catch (error) {
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const totalTasks = tasks.length;
  const activeRewards = rewards.filter((reward) => reward.isActive).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={
              parent?.avatar
                ? { uri: parent.avatar }
                : require("../../../assets/default-avatar.png")
            }
            style={styles.avatar as ImageStyle}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{parent?.name || "Parent"}</Text>
            <Text style={styles.email}>{parent?.email || ""}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedTasks}</Text>
            <Text style={styles.statLabel}>Completed Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalTasks}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{activeRewards}</Text>
            <Text style={styles.statLabel}>Active Rewards</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Child Profiles</Text>
          {children && children.length > 0 ? (
            children.map((child: Child) => (
              <View key={child.id} style={styles.childCard}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childStatus}>
                  {child.deviceId ? "Paired" : "Not Paired"}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No child profiles yet</Text>
          )}
          <Button
            title="Create Child Profile"
            onPress={handleCreateChild}
            variant="secondary"
            fullWidth
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{parent?.phone || "Not set"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <TouchableOpacity
            style={styles.settingButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.settingText}>Edit Profile</Text>
            <Text style={styles.settingIcon}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingButton}
            onPress={handleSignOut}
          >
            <Text style={[styles.settingText, styles.signOutText]}>
              Sign Out
            </Text>
            <Text style={[styles.settingIcon, styles.signOutIcon]}>→</Text>
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  } as ViewStyle,
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    marginRight: theme.spacing.md,
  } as ImageStyle,
  headerInfo: {
    flex: 1,
  } as ViewStyle,
  name: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  email: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
  } as ViewStyle,
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    alignItems: "center",
    ...theme.shadows.sm,
  } as ViewStyle,
  statValue: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  statLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
  section: {
    marginBottom: theme.spacing.xl,
  } as ViewStyle,
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  } as TextStyle,
  childCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  } as ViewStyle,
  childName: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  childStatus: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  } as TextStyle,
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  } as ViewStyle,
  infoLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  infoValue: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
  } as TextStyle,
  settingButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  } as ViewStyle,
  settingText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
  } as TextStyle,
  settingIcon: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
  signOutText: {
    color: theme.colors.error,
  } as TextStyle,
  signOutIcon: {
    color: theme.colors.error,
  } as TextStyle,
});
