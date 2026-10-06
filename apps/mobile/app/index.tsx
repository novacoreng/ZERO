import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useDynamicNotification } from "@/notifications/dynamic-notification-provider";

type Mode = "signup" | "signin";
type Method = "email" | "phone" | "passkey";

const menu = [
  ["⌂", "Home"],
  ["◌", "Messages"],
  ["+", "New message"],
  ["◇", "Data Drops"],
  ["▱", "Files"],
  ["⌁", "Devices"],
  ["✦", "Security"],
  ["◎", "Activity"],
];

export default function Home() {
  const { width } = useWindowDimensions();
  const compact = width < 700;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const [mode, setMode] = useState<Mode>("signup");
  const [method, setMethod] = useState<Method>("email");
  const [identifier, setIdentifier] = useState("");
  const [status, setStatus] = useState("Create your private identity.");
  const { notify } = useDynamicNotification();

  function choose(label: string) {
    setActive(label);
    setDrawerOpen(false);
    if (label !== "Home") notify({ title: label, message: "This test surface is ready for its connected application flow." });
  }

  function continueFlow() {
    if (method !== "passkey" && !identifier.trim()) {
      const label = method === "email" ? "email address" : "phone number";
      setStatus(`Enter your ${label}.`);
      notify({ title: "One more detail", message: `Enter your ${label} to continue.` });
      return;
    }
    if (method === "email" && !/^\S+@\S+\.\S+$/.test(identifier.trim())) {
      setStatus("Enter a valid email address.");
      notify({ title: "Check your email", message: "That address does not look valid yet." });
      return;
    }
    if (method === "phone" && !/^[+0-9][0-9\s().-]{6,}$/.test(identifier.trim())) {
      setStatus("Enter a valid phone number.");
      notify({ title: "Check your number", message: "Enter a valid phone number." });
      return;
    }
    const label = mode === "signup" ? "Sign-up" : "Sign-in";
    const channel = method === "passkey" ? "Passkey" : `${method.toUpperCase()} OTP`;
    setStatus(`${label} test request accepted. ${channel} provider boundary reached.`);
    notify({ title: `${label} ready`, message: `${channel} test boundary reached.` });
  }

  const Drawer = () => (
    <View style={styles.drawer}>
      <View style={styles.traffic}><View style={styles.red}/><View style={styles.yellow}/><View style={styles.green}/></View>
      <View style={styles.drawerBrand}><View style={styles.logo}><View style={styles.logoCore}/></View><Text style={styles.brandText}>ZERO</Text></View>
      <View style={styles.identity}><View style={styles.avatar}><Text style={styles.avatarText}>Z</Text></View><View><Text style={styles.identityTitle}>Private identity</Text><Text style={styles.identityMeta}>PIN · TEMPORARY</Text></View></View>
      <View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><Text style={styles.searchText}>SEARCH…</Text></View>
      <Text style={styles.groupLabel}>MENU</Text>
      {menu.map(([icon, label]) => (
        <Pressable key={label} accessibilityRole="button" accessibilityState={{ selected: active === label }} onPress={() => choose(label)} style={({ pressed }) => [styles.navItem, active === label && styles.navActive, pressed && styles.pressed]}>
          <Text style={[styles.navIcon, active === label && styles.navActiveText]}>{icon}</Text>
          <Text style={[styles.navText, active === label && styles.navActiveText]}>{label}</Text>
          {label === "Messages" ? <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View> : null}
        </Pressable>
      ))}
      <View style={styles.rule}/>
      <Text style={styles.groupLabel}>GENERAL</Text>
      <Pressable onPress={() => choose("Settings")} style={styles.navItem}><Text style={styles.navIcon}>⚙</Text><Text style={styles.navText}>Settings</Text></Pressable>
      <Pressable onPress={() => choose("Lock ZERO")} style={styles.navItem}><Text style={styles.navIcon}>↪</Text><Text style={styles.navText}>Lock ZERO</Text></Pressable>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {!compact ? <View style={styles.desktopDrawer}><Drawer /></View> : null}
      {compact ? (
        <Modal visible={drawerOpen} transparent animationType="fade" onRequestClose={() => setDrawerOpen(false)}>
          <View style={styles.modalRoot}>
            <Pressable accessibilityRole="button" accessibilityLabel="Close navigation" style={styles.scrim} onPress={() => setDrawerOpen(false)} />
            <View style={styles.mobileDrawer}><Drawer /></View>
          </View>
        </Modal>
      ) : null}

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, !compact && styles.scrollDesktop]}
      >
        <View style={styles.topbar}>
          {compact ? <Pressable accessibilityRole="button" accessibilityLabel="Open navigation" onPress={() => setDrawerOpen(true)} style={styles.menuButton}><Text style={styles.menuGlyph}>☰</Text></Pressable> : null}
          <View style={styles.topbarCopy}><Text style={styles.eyebrow}>ZERO / {active.toUpperCase()}</Text><Text style={styles.pageTitle}>{active === "Home" ? "Private communication." : active}</Text></View>
          <View style={styles.testPill}><View style={styles.readyDot}/><Text style={styles.testText}>TEST</Text></View>
        </View>

        <View style={[styles.hero, compact && styles.heroCompact]}>
          <Text style={styles.eyebrow}>PIN · PRIVATE · TEMPORARY · GONE</Text>
          <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>Say what matters.{"\n"}<Text style={styles.heroMuted}>Keep only what should stay.</Text></Text>
          <Text style={styles.lead}>ZERO is designed around private identity, encrypted communication and explicit message lifecycles.</Text>
          <View style={styles.heroOrb}><View style={styles.heroOrbInner}><Text style={styles.orbZ}>Z</Text></View></View>
        </View>

        <View style={styles.quickGrid}>
          {[["+", "New message", "Start privately"], ["◇", "Data Drop", "Share temporarily"], ["⌁", "Devices", "Review trust"]].map(([icon, title, copy]) => (
            <Pressable key={title} onPress={() => choose(title)} style={({ pressed }) => [styles.quickCard, pressed && styles.pressed]}>
              <View style={styles.quickIcon}><Text style={styles.quickIconText}>{icon}</Text></View>
              <Text style={styles.quickTitle}>{title}</Text><Text style={styles.quickCopy}>{copy}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.authCard}>
          <View style={styles.authMeta}><Text style={styles.groupLabel}>IDENTITY</Text><View style={styles.readyWrap}><View style={styles.readyDot}/><Text style={styles.readyText}>READY</Text></View></View>
          <Text style={styles.authTitle}>{mode === "signup" ? "Create your ZERO" : "Welcome back"}</Text>
          <Text accessibilityLiveRegion="polite" style={styles.status}>{status}</Text>

          <View style={styles.segment}>
            {(["signup", "signin"] as Mode[]).map((item) => (
              <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: mode === item }} onPress={() => { setMode(item); setStatus(item === "signup" ? "Create your private identity." : "Continue to your ZERO identity."); }} style={[styles.segmentItem, mode === item && styles.segmentActive]}>
                <Text style={[styles.segmentText, mode === item && styles.segmentTextActive]}>{item === "signup" ? "Create account" : "Sign in"}</Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.methods, compact && styles.methodsCompact]}>
            {(["email", "phone", "passkey"] as Method[]).map((item) => (
              <Pressable key={item} accessibilityRole="radio" accessibilityState={{ selected: method === item }} onPress={() => setMethod(item)} style={[styles.method, method === item && styles.methodActive]}>
                <Text style={styles.methodIcon}>{item === "email" ? "@" : item === "phone" ? "⌁" : "◇"}</Text>
                <Text style={[styles.methodText, method === item && styles.methodTextActive]}>{item === "email" ? "Email" : item === "phone" ? "Phone" : "Passkey"}</Text>
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
                placeholderTextColor="#747A82"
                keyboardType={method === "email" ? "email-address" : "phone-pad"}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete={method === "email" ? "email" : "tel"}
                style={styles.input}
                returnKeyType="go"
                onSubmitEditing={continueFlow}
              />
            </View>
          ) : null}
          <Pressable accessibilityRole="button" onPress={continueFlow} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}><Text style={styles.primaryText}>Continue →</Text></Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:"#111318"},scroll:{padding:14,paddingTop:18,paddingBottom:44,gap:14},scrollDesktop:{marginLeft:300,padding:24,maxWidth:1180,width:"100%",alignSelf:"center"},desktopDrawer:{position:"absolute",left:22,top:22,bottom:22,width:260,zIndex:20},drawer:{flex:1,borderRadius:30,borderWidth:1,borderColor:"rgba(255,255,255,0.16)",backgroundColor:"rgba(38,41,47,0.98)",overflow:"hidden",paddingBottom:18},traffic:{height:42,flexDirection:"row",alignItems:"center",gap:6,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:"rgba(255,255,255,0.07)"},red:{width:8,height:8,borderRadius:4,backgroundColor:"#FF5F57"},yellow:{width:8,height:8,borderRadius:4,backgroundColor:"#FEBC2E"},green:{width:8,height:8,borderRadius:4,backgroundColor:"#28C840"},drawerBrand:{height:66,flexDirection:"row",alignItems:"center",gap:10,paddingHorizontal:18,borderBottomWidth:1,borderBottomColor:"rgba(255,255,255,0.08)"},logo:{width:34,height:34,borderRadius:17,borderWidth:5,borderColor:"#7DE3DA",alignItems:"center",justifyContent:"center"},logoCore:{width:10,height:10,borderRadius:5,backgroundColor:"#7DE3DA"},brandText:{color:"#FFF",fontSize:19,fontWeight:"900",letterSpacing:4},identity:{minHeight:76,flexDirection:"row",alignItems:"center",gap:10,paddingHorizontal:18,borderBottomWidth:1,borderBottomColor:"rgba(255,255,255,0.08)"},avatar:{width:40,height:40,borderRadius:20,backgroundColor:"#15181D",borderWidth:1,borderColor:"rgba(255,255,255,0.18)",alignItems:"center",justifyContent:"center"},avatarText:{color:"#7DE3DA",fontWeight:"900"},identityTitle:{color:"#FFF",fontSize:13,fontWeight:"800"},identityMeta:{color:"#989DA5",fontSize:9,letterSpacing:1.2,marginTop:3},search:{height:38,margin:13,borderWidth:1,borderColor:"rgba(255,255,255,0.13)",borderRadius:19,flexDirection:"row",alignItems:"center",gap:8,paddingHorizontal:12},searchIcon:{color:"#AAA",fontSize:16},searchText:{color:"#999DA4",fontSize:9,letterSpacing:1.4},groupLabel:{color:"#B3B6BC",fontSize:9,fontWeight:"900",letterSpacing:1.8,marginHorizontal:18,marginVertical:8},navItem:{minHeight:46,flexDirection:"row",alignItems:"center",gap:9,paddingHorizontal:17},navActive:{backgroundColor:"#7DE3DA"},navIcon:{width:30,textAlign:"center",color:"#FFF",fontSize:17},navText:{flex:1,color:"#E4E5E7",fontSize:13,fontWeight:"600"},navActiveText:{color:"#071211",fontWeight:"900"},badge:{minWidth:21,height:21,borderRadius:11,backgroundColor:"#F24459",alignItems:"center",justifyContent:"center"},badgeText:{color:"#FFF",fontSize:10,fontWeight:"900"},rule:{height:1,backgroundColor:"rgba(255,255,255,0.08)",marginVertical:8,marginHorizontal:18},modalRoot:{flex:1,flexDirection:"row"},scrim:{...StyleSheet.absoluteFillObject,backgroundColor:"rgba(0,0,0,0.62)"},mobileDrawer:{width:"82%",maxWidth:310,margin:10,zIndex:2},topbar:{minHeight:72,flexDirection:"row",alignItems:"center",gap:12,borderBottomWidth:1,borderBottomColor:"rgba(255,255,255,0.1)",paddingBottom:12},menuButton:{width:44,height:44,borderRadius:22,borderWidth:1,borderColor:"rgba(255,255,255,0.14)",backgroundColor:"#25282E",alignItems:"center",justifyContent:"center"},menuGlyph:{color:"#FFF",fontSize:20},topbarCopy:{flex:1},eyebrow:{color:"#7DE3DA",fontSize:9,fontWeight:"900",letterSpacing:1.6},pageTitle:{color:"#F7F8F8",fontSize:25,fontWeight:"900",letterSpacing:-1,marginTop:3},testPill:{flexDirection:"row",alignItems:"center",gap:6,paddingHorizontal:10,paddingVertical:7,borderRadius:20,borderWidth:1,borderColor:"rgba(255,255,255,0.12)"},readyDot:{width:6,height:6,borderRadius:3,backgroundColor:"#7DE3DA"},testText:{color:"#A9ADB3",fontSize:9,fontWeight:"900"},hero:{minHeight:330,borderRadius:28,borderWidth:1,borderColor:"rgba(255,255,255,0.13)",backgroundColor:"#202329",padding:28,overflow:"hidden"},heroCompact:{minHeight:360,padding:22},heroTitle:{color:"#FFF",fontSize:56,lineHeight:57,fontWeight:"900",letterSpacing:-3,marginTop:22,maxWidth:700},heroTitleCompact:{fontSize:42,lineHeight:44,letterSpacing:-2},heroMuted:{color:"#92969E"},lead:{color:"#A4A8AE",fontSize:14,lineHeight:21,maxWidth:560,marginTop:17},heroOrb:{position:"absolute",right:-30,bottom:-60,width:220,height:220,borderRadius:110,borderWidth:1,borderColor:"rgba(125,227,218,0.18)",alignItems:"center",justifyContent:"center"},heroOrbInner:{width:118,height:118,borderRadius:59,borderWidth:1,borderColor:"rgba(125,227,218,0.28)",backgroundColor:"rgba(125,227,218,0.06)",alignItems:"center",justifyContent:"center"},orbZ:{color:"#7DE3DA",fontSize:54,fontWeight:"300"},quickGrid:{flexDirection:"row",flexWrap:"wrap",gap:10},quickCard:{flexGrow:1,flexBasis:180,minHeight:100,borderRadius:20,borderWidth:1,borderColor:"rgba(255,255,255,0.12)",backgroundColor:"#1D2025",padding:15},quickIcon:{width:36,height:36,borderRadius:18,backgroundColor:"rgba(125,227,218,0.1)",alignItems:"center",justifyContent:"center"},quickIconText:{color:"#7DE3DA",fontSize:18},quickTitle:{color:"#FFF",fontSize:13,fontWeight:"800",marginTop:9},quickCopy:{color:"#858A92",fontSize:10,marginTop:3},authCard:{borderRadius:26,borderWidth:1,borderColor:"rgba(255,255,255,0.13)",backgroundColor:"#1B1E23",padding:20,gap:13},authMeta:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},readyWrap:{flexDirection:"row",alignItems:"center",gap:6},readyText:{color:"#7DE3DA",fontSize:9,fontWeight:"900"},authTitle:{color:"#FFF",fontSize:28,fontWeight:"900",letterSpacing:-1},status:{color:"#A1A5AC",fontSize:13,lineHeight:19},segment:{flexDirection:"row",padding:4,borderRadius:14,backgroundColor:"#111318",borderWidth:1,borderColor:"rgba(255,255,255,0.1)"},segmentItem:{flex:1,minHeight:44,alignItems:"center",justifyContent:"center",borderRadius:10},segmentActive:{backgroundColor:"#EEFFFD"},segmentText:{color:"#979CA4",fontWeight:"800",fontSize:12},segmentTextActive:{color:"#071211"},methods:{flexDirection:"row",gap:7},methodsCompact:{flexWrap:"wrap"},method:{flex:1,minWidth:92,minHeight:58,borderRadius:14,borderWidth:1,borderColor:"rgba(255,255,255,0.12)",backgroundColor:"#12151A",alignItems:"center",justifyContent:"center",gap:3},methodActive:{borderColor:"rgba(125,227,218,0.5)",backgroundColor:"rgba(125,227,218,0.09)"},methodIcon:{color:"#7DE3DA",fontSize:15},methodText:{color:"#9EA3AA",fontSize:10,fontWeight:"800"},methodTextActive:{color:"#FFF"},field:{gap:7},label:{color:"#D0D2D5",fontSize:11,fontWeight:"800"},input:{minHeight:50,borderRadius:13,borderWidth:1,borderColor:"rgba(255,255,255,0.13)",backgroundColor:"#111318",color:"#FFF",paddingHorizontal:13,fontSize:16},primary:{minHeight:52,borderRadius:13,backgroundColor:"#D8FFFB",alignItems:"center",justifyContent:"center"},primaryText:{color:"#071211",fontSize:15,fontWeight:"900"},pressed:{opacity:.78}
});
