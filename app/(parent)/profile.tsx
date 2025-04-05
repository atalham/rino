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
  ImageStyle,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { theme } from "../theme";
import { Button } from "../../components/ui/Button";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { LoadingScreen } from "../../components/ui/LoadingScreen";

export default function ParentProfileScreen() {
  const { user, signOut } = useAuth();
  const { parentProfile, children, isLoading } = useData();
  const router = useRouter();

  if (isLoading) {
    return <LoadingScreen style={{ flex: 1 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <Image
            source={
              parentProfile?.avatarUrl
                ? { uri: parentProfile.avatarUrl }
                : require("../../assets/default-avatar.png")
            }
            style={styles.avatar}
          />
          <Text style={styles.name}>{parentProfile?.name || user?.email}</Text>
          <Link href="/(parent)/profile/edit" asChild>
            <TouchableOpacity>
              <Button title="Edit Profile" variant="secondary" />
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Children</Text>
            <Link href="/(parent)/profile/add-child" asChild>
              <TouchableOpacity>
                <Button title="Add Child" />
              </TouchableOpacity>
            </Link>
          </View>

          {children?.map((child) => (
            <View key={child.id} style={styles.childItem}>
              <Image
                source={
                  child.avatarUrl
                    ? { uri: child.avatarUrl }
                    : require("../../assets/default-avatar.png")
                }
                style={styles.childAvatar}
              />
              <View style={styles.childInfo}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childPoints}>{child.points} points</Text>
              </View>
            </View>
          ))}
        </View>

        <Button
          title="Sign Out"
          onPress={signOut}
          variant="secondary"
          fullWidth
        />
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
  profileHeader: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  } as ViewStyle,
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  } as ImageStyle,
  name: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text.primary,
  } as TextStyle,
  section: {
    marginBottom: theme.spacing.xl,
  } as ViewStyle,
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  sectionTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text.primary,
  } as TextStyle,
  childItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  } as ViewStyle,
  childAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: theme.spacing.md,
  } as ImageStyle,
  childInfo: {
    flex: 1,
  } as ViewStyle,
  childName: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: theme.colors.text.primary,
  } as TextStyle,
  childPoints: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primary,
  } as TextStyle,
});
