import { Stack } from "expo-router";
import { theme } from "./theme";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";

// Import your global CSS file
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <DataProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </DataProvider>
    </AuthProvider>
  );
}
