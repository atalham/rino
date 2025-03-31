import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ViewStyle,
  TextStyle,
} from "react-native";
import { theme } from "../../theme";
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

// Temporary mock data for child's coins
const mockChildCoins = 250;

export default function ChildShopScreen() {
  const [rewards] = useState(mockRewards);

  const handleRewardPress = (rewardId: string) => {
    // TODO: Implement reward redemption
  };

  const renderReward = ({ item }: { item: (typeof mockRewards)[0] }) => (
    <RewardCard
      title={item.title}
      description={item.description}
      cost={item.cost}
      onPress={() => handleRewardPress(item.id)}
      isAffordable={item.isActive && item.cost <= mockChildCoins}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.coinsContainer}>
          <Text style={styles.coinsText}>🪙 {mockChildCoins}</Text>
        </View>
        <Text style={styles.title}>Reward Shop</Text>
        <Text style={styles.subtitle}>Redeem your coins for rewards</Text>
      </View>

      <FlatList
        data={rewards}
        renderItem={renderReward}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
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
    alignItems: "center",
  } as ViewStyle,
  coinsContainer: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  coinsText: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: "#FFFFFF",
  } as TextStyle,
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
});
