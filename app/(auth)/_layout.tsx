import { Stack } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { Redirect } from "expo-router";
import { theme } from "../theme";

export default function AuthLayout() {
  const { user } = useAuth();

  // Redirect authenticated users to their appropriate screens
  if (user) {
    return (
      <Redirect href={user.userType === "parent" ? "/(parent)" : "/(child)"} />
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTitleStyle: {
          color: theme.colors.text.primary,
        },
        headerTintColor: theme.colors.primary,
        headerBackTitleVisible: false,
        headerShown: false, // Hide header by default in auth screens
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome",
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Register",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="pair-profile"
        options={{
          title: "Connect with Parent",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
