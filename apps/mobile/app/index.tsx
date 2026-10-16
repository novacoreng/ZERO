import { useState } from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

type Tab="Chats"|"Contacts"|"Settings";
export default function Home(){
 const [tab,setTab]=useState<Tab>("Chats");
 const [query,setQuery]=useState("");
 const [status,setStatus]=useState("Device PIN activation is not yet available on mobile.");
 const [checking,setChecking]=useState(false);
 async function check(){
  const api=process.env.EXPO_PUBLIC_ZERO_API_URL;
  if(!api){setStatus("Messaging service is not configured.");return;}
  setChecking(true);
  try{
   const controller=new AbortController();
   const timer=setTimeout(()=>controller.abort(),6000);
   try{
    const response=await fetch(new URL("/health",api).toString(),{signal:controller.signal});
    setStatus(response.ok?"Server reachable. Encrypted messaging is not yet available.":"Service unavailable.");
   }finally{clearTimeout(timer);}
  }catch{setStatus("Service unavailable.");}finally{setChecking(false);}
 }
 return <SafeAreaView style={s.root} edges={["top","bottom"]}><StatusBar style="light"/>
  <View style={s.header}><Text style={s.brand}>ZER<Text style={s.red}>O</Text></Text><Text style={s.headerSub}>PRIVATE MESSENGER</Text><Pressable accessibilityRole="button" accessibilityLabel="Settings" onPress={()=>setTab("Settings")}><Text style={s.icon}>⚙</Text></Pressable></View>
  <View style={s.tabs}>{(["Chats","Contacts","Settings"] as Tab[]).map((name)=><Pressable key={name} accessibilityRole="button" accessibilityState={{selected:tab===name}} onPress={()=>setTab(name)} style={[s.tab,tab===name&&s.active]}><Text style={[s.tabText,tab===name&&s.selected]}>{name==="Chats"?"▣":name==="Contacts"?"♧":"⚙"}</Text><Text style={[s.tabLabel,tab===name&&s.selected]}>{name}</Text></Pressable>)}</View>
  <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.scroll}>
   <View style={s.titleRow}><Text style={s.title}>{tab}</Text><Pressable accessibilityRole="button" accessibilityLabel="New chat" onPress={()=>{setTab("Contacts");setStatus("New chats require a connected messaging service.");}} style={s.plus}><Text style={s.plusText}>+</Text></Pressable></View>
   {tab==="Chats"?<><View style={s.search}><Text style={s.searchIcon}>⌕</Text><TextInput accessibilityLabel="Search chats" placeholder="Search by PIN or name..." placeholderTextColor="#90939a" style={s.input} value={query} onChangeText={setQuery}/></View><View style={s.empty}><Text style={s.emptySymbol}>◎</Text><Text style={s.emptyTitle}>{query?"No matching conversations":"No conversations yet"}</Text><Text style={s.muted}>Your private conversations will appear here once secure messaging is available.</Text></View></>:tab==="Contacts"?<View style={s.empty}><Text style={s.emptySymbol}>♧</Text><Text style={s.emptyTitle}>No contacts yet</Text><Text style={s.muted}>Adding contacts by device PIN is not yet connected.</Text></View>:<View style={s.settings}><Text style={s.caption}>YOUR DEVICE PIN</Text><Text style={s.pending}>Activation pending</Text><Text style={s.muted}>A secure device key must be generated in native platform storage before a PIN can be assigned. No placeholder PIN is shown.</Text><Text style={s.muted}>ZERO is free and open source under the MIT License.</Text><Pressable accessibilityRole="link" accessibilityLabel="View ZERO source code" onPress={()=>{void Linking.openURL("https://github.com/novacoreng/ZERO");}}><Text style={s.back}>Source code</Text></Pressable><Pressable accessibilityRole="link" accessibilityLabel="View MIT License" onPress={()=>{void Linking.openURL("https://github.com/novacoreng/ZERO/blob/main/LICENSE");}}><Text style={s.back}>MIT License</Text></Pressable><Pressable accessibilityRole="button" onPress={()=>setTab("Chats")}><Text style={s.back}>← Back to chats</Text></Pressable></View>}
   <View style={s.status}><View style={s.dot}/><Text style={s.statusText}>{status}</Text></View>
   <View style={s.welcome}><Text style={s.welcomeTitle}>Welcome to ZERO</Text><Text style={s.muted}>One device. One PIN. No email or phone signup.</Text><Pressable style={s.button} accessibilityRole="button" disabled={checking} onPress={check}>{checking?<ActivityIndicator color="#fff"/>:<Text style={s.buttonText}>Check connection</Text>}</Pressable><Text style={s.disclaimer}>Connection checks do not verify encryption. Messaging and mobile activation remain under development.</Text></View>
  </ScrollView>
 </SafeAreaView>;
}
const s=StyleSheet.create({
 root:{flex:1,backgroundColor:"#090b0d"},header:{height:65,flexDirection:"row",alignItems:"center",paddingHorizontal:20,gap:12,borderBottomWidth:1,borderColor:"#292c30"},brand:{color:"#fff",fontSize:25,fontWeight:"900",letterSpacing:3},red:{color:"#e51e30"},headerSub:{flex:1,color:"#7f838b",fontSize:9,letterSpacing:1.5},icon:{color:"#c7c8cd",fontSize:24},tabs:{flexDirection:"row",paddingHorizontal:16,paddingTop:12,gap:10},tab:{flex:1,alignItems:"center",paddingVertical:12,borderRadius:10,backgroundColor:"#171a1e"},active:{backgroundColor:"#42161d"},tabText:{fontSize:21,color:"#92969d"},tabLabel:{fontSize:11,color:"#92969d",marginTop:4},selected:{color:"#ff6574"},scroll:{flexGrow:1,paddingBottom:35},titleRow:{paddingHorizontal:20,paddingTop:25,paddingBottom:18,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},title:{fontSize:25,fontWeight:"800",color:"#fff"},plus:{width:39,height:39,backgroundColor:"#e51e30",borderRadius:10,alignItems:"center",justifyContent:"center"},plusText:{color:"#fff",fontSize:28},search:{marginHorizontal:18,backgroundColor:"#1d2226",borderRadius:11,flexDirection:"row",alignItems:"center",paddingHorizontal:14},searchIcon:{fontSize:22,color:"#a3a5ac",marginRight:10},input:{height:48,flex:1,color:"#fff"},empty:{minHeight:220,alignItems:"center",justifyContent:"center",paddingHorizontal:35},emptySymbol:{fontSize:38,color:"#e51e30"},emptyTitle:{color:"#fff",fontWeight:"700",fontSize:17,marginTop:14,marginBottom:8},muted:{color:"#9b9da4",fontSize:13,lineHeight:20,textAlign:"center"},settings:{paddingHorizontal:26,paddingVertical:36,alignItems:"center",gap:15},caption:{color:"#9b9da4",fontSize:11,letterSpacing:2},pending:{color:"#ff7785",fontSize:20,fontWeight:"700"},back:{color:"#ff7785",marginTop:10},status:{marginHorizontal:18,padding:15,backgroundColor:"#23161b",borderRadius:10,flexDirection:"row",gap:10,alignItems:"center"},dot:{width:8,height:8,borderRadius:4,backgroundColor:"#e51e30"},statusText:{color:"#f3b3bc",fontSize:12,flex:1},welcome:{alignItems:"center",paddingHorizontal:30,paddingTop:32},welcomeTitle:{color:"#fff",fontSize:21,fontWeight:"800",marginBottom:12},button:{backgroundColor:"#e51e30",borderRadius:10,paddingHorizontal:25,paddingVertical:14,marginTop:24},buttonText:{color:"#fff",fontWeight:"700"},disclaimer:{color:"#858891",fontSize:11,textAlign:"center",lineHeight:17,marginTop:15}
});
