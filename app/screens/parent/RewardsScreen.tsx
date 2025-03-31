import React, { useState } from "react";
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
import { RewardCard } from "../../../components/RewardCard";

// Temporary mock data
const mockRewards = [
  {
    id: "1",
    title: "Extra Screen Time",
    description: "30 minutes of additional screen time",
    cost: 100,
    isActive: true,
  },
  {
    id: "2",
    title: "Ice Cream Treat",
    description: "One ice cream cone of choice",
    cost: 150,
    isActive: true,
  },
  {
    id: "3",
    title: "New Toy",
    description: "Choose a toy under $20",
    cost: 500,
    isActive: false,
  },
];

export default function ParentRewardsScreen() {
  const [rewards, setRewards] = useState(mockRewards);

  const handleRewardPress = (rewardId: string) => {
    // TODO: Navigate to reward details
  };

  const handleCreateReward = () => {
    // TODO: Navigate to create reward screen
  };

  const renderReward = ({ item }: { item: (typeof mockRewards)[0] }) => (
    <RewardCard
      title={item.title}
      description={item.description}
      cost={item.cost}
      onPress={() => handleRewardPress(item.id)}
      isAffordable={item.isActive}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.subtitle}>Manage rewards for your children</Text>
      </View>

      <FlatList
        data={rewards}
        renderItem={renderReward}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <Button
          title="Create New Reward"
          onPress={handleCreateReward}
          fullWidth
        />
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
  list: {
    padding: theme.spacing.lg,
  } as ViewStyle,
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  } as ViewStyle,
});
