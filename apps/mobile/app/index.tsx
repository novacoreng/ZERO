import { useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
export default function Home(){
 const [query,setQuery]=useState("");
 const [status,setStatus]=useState("Messaging is not connected");
 const [checking,setChecking]=useState(false);
 const [settings,setSettings]=useState(false);
 async function check(){
  const api=process.env.EXPO_PUBLIC_ZERO_API_URL;
  if(!api){setStatus("Messaging service is not configured");return;}
  setChecking(true);
  try{
   const controller=new AbortController();
   const timer=setTimeout(()=>controller.abort(),6000);
   try{
    const response=await fetch(new URL("/health",api).toString(),{signal:controller.signal});
    setStatus(response.ok?"Server reachable. Secure messaging is not connected.":"Messaging service unavailable");
   }finally{clearTimeout(timer);}
  }catch{setStatus("Messaging service unavailable");}
  finally{setChecking(false);}
 }
 return <SafeAreaView style={s.root}><StatusBar style="light"/><View style={s.header}><View style={s.logo}><Text style={s.logoText}>Z</Text></View><Text style={s.brand}>ZERO</Text><Pressable accessibilityRole="button" accessibilityLabel="Settings" onPress={()=>setSettings(v=>!v)}><Text style={s.headerAction}>⚙</Text></Pressable></View>
 <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
 <View style={s.titleRow}><Text style={s.title}>{settings?"Settings":"Chats"}</Text><Pressable accessibilityRole="button" accessibilityLabel="New chat" onPress={()=>setStatus("Secure sign-in is required before starting a chat")}><Text style={s.new}>＋</Text></Pressable></View>
 {settings?<View style={s.settings}><Text style={s.secondary}>Account settings become available when secure sign-in is connected.</Text><Pressable onPress={()=>setSettings(false)}><Text style={s.link}>Back to chats</Text></Pressable></View>:<><View style={s.search}><Text style={s.searchIcon}>⌕</Text><TextInput accessibilityLabel="Search chats" placeholder="Search chats" placeholderTextColor="#95888e" value={query} onChangeText={setQuery} style={s.input}/></View><View style={s.empty}><Text style={s.emptyIcon}>◎</Text><Text style={s.emptyTitle}>{query?"No matching conversations":"No conversations yet"}</Text><Text style={s.secondary}>{query?"Try another search.":"Your chats will appear here after secure sign-in."}</Text></View></>}
 <View style={s.footer}><View style={s.dot}/><Text style={s.footerText}>{status}</Text></View>
 <View style={s.welcome}><Text style={s.welcomeTitle}>Welcome to ZERO</Text><Text style={s.secondary}>Simple, private messaging. Conversations will appear once your account and messaging service are connected.</Text><Pressable style={s.button} accessibilityRole="button" disabled={checking} onPress={check}>{checking?<ActivityIndicator color="#fff"/>:<Text style={s.buttonText}>Check connection</Text>}</Pressable><Text style={s.note}>A health check does not verify encryption.</Text></View>
 </ScrollView></SafeAreaView>;
}
const s=StyleSheet.create({
 root:{flex:1,backgroundColor:"#151216"},header:{height:62,flexDirection:"row",alignItems:"center",gap:12,paddingHorizontal:20,borderBottomWidth:1,borderColor:"#30272b",backgroundColor:"#1b171b"},logo:{width:30,height:30,borderRadius:9,backgroundColor:"#e94458",alignItems:"center",justifyContent:"center"},logoText:{color:"#fff",fontWeight:"900"},brand:{flex:1,color:"#fff",fontSize:18,fontWeight:"800",letterSpacing:2},headerAction:{color:"#bfb0b7",fontSize:24},scroll:{flexGrow:1,paddingBottom:35},titleRow:{paddingHorizontal:22,paddingTop:22,paddingBottom:14,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},title:{color:"#fff",fontSize:24,fontWeight:"800"},new:{color:"#f06a7b",fontSize:28},search:{marginHorizontal:18,backgroundColor:"#30282d",borderRadius:12,flexDirection:"row",alignItems:"center",paddingHorizontal:14},searchIcon:{color:"#b5a6ae",fontSize:23,marginRight:10},input:{flex:1,height:46,color:"#fff",fontSize:14},empty:{alignItems:"center",justifyContent:"center",paddingVertical:55,paddingHorizontal:25},emptyIcon:{fontSize:32,color:"#a58d96"},emptyTitle:{fontSize:15,color:"#e5dbe0",marginTop:12,marginBottom:5},secondary:{color:"#aa9da3",fontSize:13,lineHeight:21,textAlign:"center"},footer:{flexDirection:"row",alignItems:"center",gap:8,paddingHorizontal:20,paddingVertical:14,borderTopWidth:1,borderColor:"#30272b"},dot:{width:8,height:8,borderRadius:4,backgroundColor:"#e94458"},footerText:{color:"#b8aab1",fontSize:12},welcome:{alignItems:"center",paddingHorizontal:30,paddingTop:40},welcomeTitle:{color:"#fff",fontSize:22,fontWeight:"800",marginBottom:12},button:{backgroundColor:"#e94458",borderRadius:10,paddingVertical:13,paddingHorizontal:22,marginTop:25},buttonText:{color:"#fff",fontWeight:"800"},note:{color:"#82777d",fontSize:11,marginTop:15},settings:{padding:24,gap:18},link:{color:"#f06a7b",textAlign:"center"}
});
