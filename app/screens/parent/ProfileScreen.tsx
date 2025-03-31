import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { theme } from "../../theme";
import { Button } from "../../../components/ui/Button";

// Temporary mock data
const mockChildren = [
  {
    id: "1",
    name: "Child 1",
    age: 8,
    coins: 250,
    completedTasks: 12,
    totalTasks: 15,
  },
  {
    id: "2",
    name: "Child 2",
    age: 6,
    coins: 180,
    completedTasks: 8,
    totalTasks: 10,
  },
];

export default function ParentProfileScreen() {
  const handleAddChild = () => {
    // TODO: Navigate to add child screen
  };

  const handleChildPress = (childId: string) => {
    // TODO: Navigate to child details
  };

  const renderChild = ({ item }: { item: (typeof mockChildren)[0] }) => (
    <TouchableOpacity
      style={styles.childCard}
      onPress={() => handleChildPress(item.id)}
    >
      <View style={styles.childHeader}>
        <View style={styles.childInfo}>
          <Text style={styles.childName}>{item.name}</Text>
          <Text style={styles.childAge}>{item.age} years old</Text>
        </View>
        <View style={styles.coinsContainer}>
          <Text style={styles.coinsText}>🪙 {item.coins}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(item.completedTasks / item.totalTasks) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {item.completedTasks} of {item.totalTasks} tasks completed
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account and children</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Children</Text>
        <FlatList
          data={mockChildren}
          renderItem={renderChild}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.childrenList}
        />
        <Button
          title="Add Child"
          variant="outline"
          onPress={handleAddChild}
          fullWidth
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, styles.logoutButton]}>
          <Text style={[styles.settingText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  } as ViewStyle,
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    color: theme.colors.text.secondary,
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
  childrenList: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  childCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  } as ViewStyle,
  childHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  childInfo: {
    gap: theme.spacing.xs,
  } as ViewStyle,
  childName: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text.primary,
  } as TextStyle,
  childAge: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
  coinsContainer: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  } as ViewStyle,
  coinsText: {
    color: "#FFFFFF",
    fontWeight: "600" as const,
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
