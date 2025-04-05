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
import { Link } from "expo-router";
import { theme } from "../theme";
import { Button } from "../../components/ui/Button";
import { RewardCard } from "../../components/ui/RewardCard";
import { useData } from "../contexts/DataContext";
import { LoadingScreen } from "../../components/ui/LoadingScreen";

export default function ParentRewardsScreen() {
  const { rewards, isLoading } = useData();

  if (isLoading) {
    return <LoadingScreen style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
        <Link href="/(parent)/rewards/new" asChild>
          <TouchableOpacity>
            <Button title="Add Reward" />
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={rewards}
        renderItem={({ item }) => (
          <Link href={`/(parent)/rewards/${item.id}`} asChild>
            <TouchableOpacity>
              <RewardCard reward={item} />
            </TouchableOpacity>
          </Link>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text.primary,
  } as TextStyle,
  list: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  } as ViewStyle,
});
