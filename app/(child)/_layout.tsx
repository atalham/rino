import { Tabs } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { Redirect } from "expo-router";
import { theme } from "../theme";
import { Ionicons } from "@expo/vector-icons";

export default function ChildLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  if (user.userType !== "child") {
    return <Redirect href="/(parent)" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.light,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTitleStyle: {
          color: theme.colors.text.primary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Tasks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
