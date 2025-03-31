import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { theme } from "../../theme";
import { useAuth } from "../../contexts/AuthContext";

// Temporary mock data
const mockChild = {
  name: "Child 1",
  age: 8,
  coins: 250,
  completedTasks: 12,
  totalTasks: 15,
  achievements: [
    {
      id: "1",
      title: "Task Master",
      description: "Complete 10 tasks",
      progress: 12,
      total: 10,
      isCompleted: true,
    },
    {
      id: "2",
      title: "Early Bird",
      description: "Complete 5 tasks before noon",
      progress: 3,
      total: 5,
      isCompleted: false,
    },
    {
      id: "3",
      title: "Streak Champion",
      description: "Complete tasks for 7 days in a row",
      progress: 5,
      total: 7,
      isCompleted: false,
    },
  ],
};

export default function ChildProfileScreen() {
  const { signOut } = useAuth();

  const handleAchievementPress = (achievementId: string) => {
    // TODO: Navigate to achievement details
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👶</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{mockChild.name}</Text>
            <Text style={styles.age}>{mockChild.age} years old</Text>
          </View>
        </View>
        <View style={styles.coinsContainer}>
          <Text style={styles.coinsText}>🪙 {mockChild.coins}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Task Progress</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (mockChild.completedTasks / mockChild.totalTasks) * 100
                  }%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {mockChild.completedTasks} of {mockChild.totalTasks} tasks completed
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {mockChild.achievements.map((achievement) => (
          <TouchableOpacity
            key={achievement.id}
            style={styles.achievementCard}
            onPress={() => handleAchievementPress(achievement.id)}
          >
            <View style={styles.achievementHeader}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementProgress}>
                {achievement.progress}/{achievement.total}
              </Text>
            </View>
            <Text style={styles.achievementDescription}>
              {achievement.description}
            </Text>
            <View style={styles.achievementProgressBar}>
              <View
                style={[
                  styles.achievementProgressFill,
                  {
                    width: `${
                      (achievement.progress / achievement.total) * 100
                    }%`,
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.settingItem, styles.logoutButton]}
          onPress={signOut}
        >
          <Text style={[styles.settingText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  } as ViewStyle,
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  avatar: {
    fontSize: 32,
  } as TextStyle,
  profileInfo: {
    gap: theme.spacing.xs,
  } as ViewStyle,
  name: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text.primary,
  } as TextStyle,
  age: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
  coinsContainer: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  } as ViewStyle,
  coinsText: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: "#FFFFFF",
  } as TextStyle,
  section: {
    padding: theme.spacing.lg,
  } as ViewStyle,
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  } as TextStyle,
  progressContainer: {
    gap: theme.spacing.xs,
  } as ViewStyle,
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.full,
    overflow: "hidden",
  } as ViewStyle,
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  } as ViewStyle,
  progressText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
  achievementCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  } as ViewStyle,
  achievementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  } as ViewStyle,
  achievementTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text.primary,
  } as TextStyle,
  achievementProgress: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
  achievementDescription: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  } as TextStyle,
  achievementProgressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.full,
    overflow: "hidden",
  } as ViewStyle,
  achievementProgressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  } as ViewStyle,
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as ViewStyle,
  settingText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
  } as TextStyle,
  logoutButton: {
    marginTop: theme.spacing.lg,
    borderBottomWidth: 0,
  } as ViewStyle,
  logoutText: {
    color: theme.colors.error,
  } as TextStyle,
});
