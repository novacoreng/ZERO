import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DynamicNotificationProvider } from "@/notifications/dynamic-notification-provider";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DynamicNotificationProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
      </DynamicNotificationProvider>
    </SafeAreaProvider>
  );
}
