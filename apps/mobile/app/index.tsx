import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as Notifications from "expo-notifications";
import { useDynamicNotification } from "@/notifications/dynamic-notification-provider";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type Mode = "signup" | "signin";
type Method = "email" | "phone" | "passkey";

export default function Home() {
  const [mode, setMode] = useState<Mode>("signup");
  const [method, setMethod] = useState<Method>("email");
  const [identifier, setIdentifier] = useState("");
  const [status, setStatus] = useState("Create your private identity.");
  const { notify } = useDynamicNotification();

  function continueFlow() {
    if (method !== "passkey" && !identifier.trim()) {
      setStatus(`Enter your ${method === "email" ? "email address" : "phone number"}.`);
      notify({ title: "ZERO needs one more thing", message: "Enter your identifier to continue." });
      return;
    }

    if (method === "email" && !/^\S+@\S+\.\S+$/.test(identifier.trim())) {
      setStatus("Enter a valid email address.");
      notify({ title: "Check your email", message: "That address does not look valid yet." });
      return;
    }

    if (method === "phone" && !/^[+0-9][0-9\s().-]{6,}$/.test(identifier.trim())) {
      setStatus("Enter a valid phone number.");
      notify({ title: "Check your number", message: "Enter a valid phone number to continue." });
      return;
    }

    const label = mode === "signup" ? "Sign-up" : "Sign-in";
    setStatus(`${label} test request accepted. Provider integration is the next runtime boundary.`);
    notify({ title: `${label} ready`, message: `${method === "passkey" ? "Passkey" : method.toUpperCase()} flow reached the test boundary.` });
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.mark}><View style={styles.markCore} /></View>
          <Text style={styles.wordmark}>ZERO</Text>
          <Text style={styles.eyebrow}>PIN · PRIVATE · TEMPORARY · GONE</Text>
          <Text style={styles.title}>Private communication without the baggage.</Text>
          <Text style={styles.lead}>A clean testing surface for encrypted identity, disappearing messages and private sharing.</Text>
        </View>

        <View style={styles.segment} accessibilityRole="tablist">
          {(["signup", "signin"] as Mode[]).map((item) => (
            <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: mode === item }} onPress={() => { setMode(item); setStatus(item === "signup" ? "Create your private identity." : "Sign in to your ZERO identity."); }} style={[styles.segmentItem, mode === item && styles.segmentActive]}>
              <Text style={[styles.segmentText, mode === item && styles.segmentTextActive]}>{item === "signup" ? "Create ZERO" : "Sign in"}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{mode === "signup" ? "Create your private identity" : "Sign in securely"}</Text>
          <Text accessibilityRole="text" style={styles.status}>{status}</Text>

          <View style={styles.methods} accessibilityRole="radiogroup">
            {(["email", "phone", "passkey"] as Method[]).map((item) => (
              <Pressable key={item} accessibilityRole="radio" accessibilityState={{ selected: method === item }} onPress={() => setMethod(item)} style={[styles.method, method === item && styles.methodActive]}>
                <Text style={[styles.methodText, method === item && styles.methodTextActive]}>{item === "email" ? "Email OTP" : item === "phone" ? "Phone OTP" : "Passkey"}</Text>
              </Pressable>
            ))}
          </View>

          {method !== "passkey" ? (
            <View style={styles.field}>
              <Text style={styles.label}>{method === "email" ? "Email address" : "Phone number"}</Text>
              <TextInput
                accessibilityLabel={method === "email" ? "Email address" : "Phone number"}
                value={identifier}
                onChangeText={setIdentifier}
                placeholder={method === "email" ? "you@example.com" : "+234 800 000 0000"}
                placeholderTextColor="#6E8090"
                keyboardType={method === "email" ? "email-address" : "phone-pad"}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                returnKeyType="go"
                onSubmitEditing={continueFlow}
              />
            </View>
          ) : null}

          <Pressable accessibilityRole="button" onPress={continueFlow} style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]}>
            <Text style={styles.primaryText}>Continue</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {[
            ["E2EE", "Private by design."],
            ["Shred", "Temporary content has a defined lifecycle."],
            ["Files", "Encrypted file workflows are being built phase-by-phase."],
            ["Alerts", "Dynamic Island-style in-app notifications are enabled."],
          ].map(([title, copy]) => (
            <View key={title} style={styles.tile}><Text style={styles.tileTitle}>{title}</Text><Text style={styles.tileCopy}>{copy}</Text></View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#05090F" },
  scroll: { width: "100%", maxWidth: 900, alignSelf: "center", padding: 20, paddingTop: 44, paddingBottom: 48, gap: 20 },
  hero: { gap: 12 },
  mark: { width: 58, height: 58, borderRadius: 29, borderWidth: 8, borderColor: "#2BB9B7", alignItems: "center", justifyContent: "center", marginBottom: 2 },
  markCore: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#76E2D8" },
  wordmark: { color: "#F7FFFE", fontSize: 18, fontWeight: "900", letterSpacing: 5 },
  eyebrow: { color: "#76E2D8", fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: "#F7FFFE", fontSize: 42, lineHeight: 44, fontWeight: "800", maxWidth: 760 },
  lead: { color: "#9AAAB9", fontSize: 16, lineHeight: 24, maxWidth: 650 },
  segment: { flexDirection: "row", padding: 4, borderRadius: 16, backgroundColor: "#0B121C", borderWidth: 1, borderColor: "#1E2B3A" },
  segmentItem: { flex: 1, minHeight: 48, alignItems: "center", justifyContent: "center", borderRadius: 12 },
  segmentActive: { backgroundColor: "#E8FFFC" },
  segmentText: { color: "#9AAAB9", fontWeight: "800" },
  segmentTextActive: { color: "#061014" },
  card: { padding: 20, borderRadius: 22, backgroundColor: "#0B121C", borderWidth: 1, borderColor: "#243447", gap: 14 },
  cardTitle: { color: "#F7FFFE", fontSize: 22, fontWeight: "800" },
  status: { color: "#9AAAB9", lineHeight: 21 },
  methods: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  method: { minHeight: 44, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: "#2B3A4D", backgroundColor: "#071019", justifyContent: "center" },
  methodActive: { borderColor: "#76E2D8", backgroundColor: "#10242A" },
  methodText: { color: "#B2C0CC", fontWeight: "700" },
  methodTextActive: { color: "#F7FFFE" },
  field: { gap: 7 },
  label: { color: "#D5E1E8", fontSize: 13, fontWeight: "800" },
  input: { minHeight: 50, borderRadius: 13, borderWidth: 1, borderColor: "#2B3A4D", backgroundColor: "#060D15", color: "#F7FFFE", paddingHorizontal: 14, fontSize: 16 },
  primary: { minHeight: 50, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "#E8FFFC" },
  primaryPressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  primaryText: { color: "#061014", fontSize: 16, fontWeight: "900" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: { flexGrow: 1, flexBasis: 180, minHeight: 110, padding: 16, borderRadius: 18, backgroundColor: "#081019", borderWidth: 1, borderColor: "#1D2A39", gap: 7 },
  tileTitle: { color: "#F7FFFE", fontWeight: "900", fontSize: 14 },
  tileCopy: { color: "#8192A1", lineHeight: 18, fontSize: 12 },
});
