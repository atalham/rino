import { Stack } from "expo-router";
import { theme } from "./theme";
import { AuthProvider } from "./contexts/AuthContext";

// Import your global CSS file
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AuthProvider>
  );
}
