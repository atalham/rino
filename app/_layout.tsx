import { useEffect } from "react";
import { Slot, SplashScreen } from "expo-router";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";

// Import your global CSS file
import "../global.css";

// Ensure we preserve the splash screen until we're ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after providers are initialized
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <DataProvider>
        <Slot />
      </DataProvider>
    </AuthProvider>
  );
}
