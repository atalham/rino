import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { theme } from "../../theme";
import { Button } from "../../../components/ui/Button";
import { RewardCard } from "../../components/ui/RewardCard";
import { useData } from "../../contexts/DataContext";
import { LoadingScreen } from "../../components/ui/LoadingScreen";

function ParentRewardsScreen() {
  const router = useRouter();
  const { rewards, isLoading, deleteReward } = useData();

  const handleRewardPress = (rewardId: string) => {
    router.push(`/parent/rewards/${rewardId}`);
  };

  const handleRewardDelete = (rewardId: string) => {
    Alert.alert(
      "Delete Reward",
      "Are you sure you want to delete this reward?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteReward(rewardId),
        },
      ]
    );
  };

  const handleCreateReward = () => {
    router.push("/parent/rewards/new");
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.subtitle}>Manage available rewards</Text>
      </View>

      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RewardCard
            reward={item}
            onPress={() => handleRewardPress(item.id)}
            onDelete={() => handleRewardDelete(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No rewards yet</Text>
            <Text style={styles.emptySubtext}>
              Create a reward to get started
            </Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Button title="Create Reward" onPress={handleCreateReward} fullWidth />
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
    color: theme.colors.text.secondary,
  } as TextStyle,
  list: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  } as ViewStyle,
  emptyContainer: {
    alignItems: "center",
    padding: theme.spacing.xl,
  } as ViewStyle,
  emptyText: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  emptySubtext: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  } as ViewStyle,
});

export default ParentRewardsScreen;
