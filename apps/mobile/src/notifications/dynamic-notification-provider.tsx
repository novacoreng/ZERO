import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

type Notice = {
  id: string;
  title: string;
  message?: string;
  duration?: number;
  onPress?: () => void;
};

type NoticeContextValue = {
  notify: (notice: Omit<Notice, "id"> & { id?: string }) => void;
  dismiss: () => void;
};

const NoticeContext = createContext<NoticeContextValue | null>(null);

export function useDynamicNotification() {
  const value = useContext(NoticeContext);
  if (!value) throw new Error("useDynamicNotification must be used inside DynamicNotificationProvider");
  return value;
}

export function DynamicNotificationProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [notice, setNotice] = useState<Notice | null>(null);
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    Animated.parallel([
      Animated.spring(translateY, { toValue: -120, useNativeDriver: true, speed: 22, bounciness: 2 }),
      Animated.timing(opacity, { toValue: 0, duration: 140, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) setNotice(null);
    });
  }, [opacity, translateY]);

  const notify = useCallback((input: Omit<Notice, "id"> & { id?: string }) => {
    if (timer.current) clearTimeout(timer.current);
    const next: Notice = { ...input, id: input.id ?? `${Date.now()}` };
    setNotice(next);
    translateY.setValue(-120);
    opacity.setValue(0);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 6 }),
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
    timer.current = setTimeout(dismiss, input.duration ?? 3200);
  }, [dismiss, opacity, translateY]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const responder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 8,
    onPanResponderMove: (_, g) => {
      if (g.dy < 0) translateY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy < -36 || g.vy < -0.7) dismiss();
      else Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
    },
  }), [dismiss, translateY]);

  return (
    <NoticeContext.Provider value={{ notify, dismiss }}>
      <View style={styles.root}>
        {children}
        {notice ? (
          <Animated.View
            {...responder.panHandlers}
            accessible
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            style={[styles.overlay, { top: Math.max(insets.top + 8, 14), opacity, transform: [{ translateY }] }]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${notice.title}${notice.message ? `, ${notice.message}` : ""}`}
              onPress={() => { notice.onPress?.(); dismiss(); }}
              onLongPress={dismiss}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
              <View style={styles.orb} />
              <View style={styles.copy}>
                <Text numberOfLines={1} style={styles.title}>{notice.title}</Text>
                {notice.message ? <Text numberOfLines={2} style={styles.message}>{notice.message}</Text> : null}
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Dismiss notification" onPress={dismiss} hitSlop={12} style={styles.close}>
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </Pressable>
          </Animated.View>
        ) : null}
      </View>
    </NoticeContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#05090F" },
  overlay: { position: "absolute", left: 12, right: 12, zIndex: 9999, alignItems: "center" },
  card: { width: "100%", maxWidth: 520, minHeight: 64, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 28, backgroundColor: "rgba(12, 20, 31, 0.96)", borderWidth: 1, borderColor: "rgba(118,226,216,0.34)", shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 10 },
  pressed: { opacity: 0.88 },
  orb: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#76E2D8", shadowColor: "#76E2D8", shadowOpacity: 0.5, shadowRadius: 12 },
  copy: { flex: 1, marginHorizontal: 12, minWidth: 0 },
  title: { color: "#F7FFFE", fontSize: 14, fontWeight: "800" },
  message: { color: "#A8B8C6", fontSize: 12, lineHeight: 17, marginTop: 2 },
  close: { width: 32, height: 32, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: "rgba(255,255,255,0.06)" },
  closeText: { color: "#D6E1E8", fontSize: 22, lineHeight: 24 },
});
