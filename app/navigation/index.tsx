import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  RootStackParamList,
  ParentTabParamList,
  ChildTabParamList,
  AuthStackParamList,
} from "../types/navigation";
import { theme } from "../theme";
import { useAuth } from "../contexts/AuthContext";
import { LoadingScreen } from "../components/ui/LoadingScreen";

// Import screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import UserTypeScreen from "../screens/auth/UserTypeScreen";
import ParentTasksScreen from "../screens/parent/TasksScreen";
import ParentRewardsScreen from "../screens/parent/RewardsScreen";
import ParentProfileScreen from "../screens/parent/ProfileScreen";
import ChildTasksScreen from "../screens/child/TasksScreen";
import ChildShopScreen from "../screens/child/ShopScreen";
import ChildProfileScreen from "../screens/child/ProfileScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const ParentTab = createBottomTabNavigator<ParentTabParamList>();
const ChildTab = createBottomTabNavigator<ChildTabParamList>();

const ParentNavigator = () => {
  return (
    <ParentTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.light,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <ParentTab.Screen
        name="Tasks"
        component={ParentTasksScreen}
        options={{
          title: "Tasks",
          // We'll add icons later
        }}
      />
      <ParentTab.Screen
        name="Rewards"
        component={ParentRewardsScreen}
        options={{
          title: "Rewards",
          // We'll add icons later
        }}
      />
      <ParentTab.Screen
        name="Profile"
        component={ParentProfileScreen}
        options={{
          title: "Profile",
          // We'll add icons later
        }}
      />
    </ParentTab.Navigator>
  );
};

const ChildNavigator = () => {
  return (
    <ChildTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.light,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <ChildTab.Screen
        name="MyTasks"
        component={ChildTasksScreen}
        options={{
          title: "My Tasks",
          // We'll add icons later
        }}
      />
      <ChildTab.Screen
        name="Shop"
        component={ChildShopScreen}
        options={{
          title: "Shop",
          // We'll add icons later
        }}
      />
      <ChildTab.Screen
        name="Profile"
        component={ChildProfileScreen}
        options={{
          title: "Profile",
          // We'll add icons later
        }}
      />
    </ChildTab.Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="UserType" component={UserTypeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

export const Navigation = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen style={{ flex: 1 }} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!user ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : user.userType === "parent" ? (
        <Stack.Screen name="ParentMain" component={ParentNavigator} />
      ) : (
        <Stack.Screen name="ChildMain" component={ChildNavigator} />
      )}
    </Stack.Navigator>
  );
};
