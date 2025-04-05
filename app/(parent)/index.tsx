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
import { TaskCard } from "../../components/ui/TaskCard";
import { useData } from "../contexts/DataContext";
import { LoadingScreen } from "../../components/ui/LoadingScreen";

export default function ParentTasksScreen() {
  const { tasks, children, isLoading } = useData();

  if (isLoading) {
    return <LoadingScreen style={{ flex: 1 }} />;
  }

  const pendingTasks =
    tasks?.filter((task) => task.status === "pending_approval") || [];
  const completedTasks =
    tasks?.filter((task) => task.status === "completed") || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tasks</Text>
          <Text style={styles.subtitle}>{children?.length || 0} children</Text>
        </View>
        <Link href="/(parent)/tasks/new" asChild>
          <TouchableOpacity>
            <Button title="New Task" onPress={() => {}} />
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={[
          { title: "Pending Tasks", data: pendingTasks },
          { title: "Completed Tasks", data: completedTasks },
        ]}
        renderItem={({ item: section }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.data.map((task) => (
              <Link key={task.id} href={`/(parent)/tasks/${task.id}`} asChild>
                <TouchableOpacity>
                  <TaskCard task={task} onPress={() => {}} />
                </TouchableOpacity>
              </Link>
            ))}
            {section.data.length === 0 && (
              <Text style={styles.emptyText}>No tasks</Text>
            )}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
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
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,
  list: {
    padding: theme.spacing.lg,
  } as ViewStyle,
  section: {
    marginBottom: theme.spacing.xl,
  } as ViewStyle,
  sectionTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  } as TextStyle,
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    textAlign: "center",
    padding: theme.spacing.lg,
  } as TextStyle,
});
