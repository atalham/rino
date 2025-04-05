import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { useRouter } from "expo-router";
import { theme } from "../theme";
import { Button } from "../../components/ui/Button";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { LoadingScreen } from "../../components/ui/LoadingScreen";

export default function ChildProfileScreen() {
  const { user, signOut } = useAuth();
  const { childProfile, childPoints, isLoading } = useData();
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
              childProfile?.avatarUrl
                ? { uri: childProfile.avatarUrl }
                : require("../../assets/default-avatar.png")
            }
            style={styles.avatar}
          />
          <Text style={styles.name}>{childProfile?.name || user?.email}</Text>
          <Text style={styles.points}>{childPoints} points earned</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {childProfile?.completedTasks || 0}
            </Text>
            <Text style={styles.statLabel}>Tasks Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {childProfile?.redeemedRewards || 0}
            </Text>
            <Text style={styles.statLabel}>Rewards Redeemed</Text>
          </View>
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
  points: {
    fontSize: theme.typography.h2.fontSize,
    color: theme.colors.primary,
  } as TextStyle,
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  } as ViewStyle,
  statItem: {
    alignItems: "center",
  } as ViewStyle,
  statValue: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text.primary,
  } as TextStyle,
  statLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
});
