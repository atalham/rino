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
import { theme } from "../theme";
import { RewardCard } from "../../components/ui/RewardCard";
import { useData } from "../contexts/DataContext";
import { LoadingScreen } from "../../components/ui/LoadingScreen";

export default function ShopScreen() {
  const { rewards, isLoading, redeemReward, childPoints } = useData();
  const router = useRouter();

  if (isLoading) {
    return <LoadingScreen style={{ flex: 1 }} />;
  }

  const handleRedeemReward = async (rewardId: string, cost: number) => {
    if (childPoints < cost) {
      Alert.alert(
        "Not Enough Points",
        "You need more points to redeem this reward."
      );
      return;
    }

    try {
      await redeemReward(rewardId);
      Alert.alert("Success", "Reward redeemed successfully!");
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to redeem reward");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Reward Shop</Text>
          <Text style={styles.points}>{childPoints} points available</Text>
        </View>
      </View>

      <FlatList
        data={rewards}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleRedeemReward(item.id, item.cost)}
          >
            <RewardCard reward={item} isAffordable={childPoints >= item.cost} />
          </TouchableOpacity>
        )}
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
  } as ViewStyle,
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  points: {
    fontSize: theme.typography.h3.fontSize,
    color: theme.colors.primary,
  } as TextStyle,
  list: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  } as ViewStyle,
});
