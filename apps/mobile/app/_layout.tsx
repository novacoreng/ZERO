import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DynamicNotificationProvider } from "@/notifications/dynamic-notification-provider";

export default function RootLayout() {
  return (
    <DynamicNotificationProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
    </DynamicNotificationProvider>
  );
}
