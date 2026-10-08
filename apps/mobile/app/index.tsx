import { useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Home(){
 const [checking,setChecking]=useState(false);
 const [message,setMessage]=useState("Account and encrypted messaging services are not configured for verified use.");
 async function check(){
   const api=process.env.EXPO_PUBLIC_ZERO_API_URL;
   if(!api){setMessage("Messaging service URL is not configured.");return;}
   setChecking(true);
   try{
     const controller=new AbortController();
     const timer=setTimeout(()=>controller.abort(),6000);
     try{
       const response=await fetch(new URL("/health",api).toString(),{signal:controller.signal});
       setMessage(response.ok?"Service is reachable, but secure sign-in and encrypted messaging are not yet verified.":"The service is unavailable.");
     }finally{clearTimeout(timer);}
   }catch{setMessage("The service is unavailable.");}
   finally{setChecking(false);}
 }
 return <SafeAreaView style={s.root}><StatusBar style="light"/><View style={s.card}>
   <View style={s.brand}><View style={s.mark}><Text style={s.markText}>Z</Text></View><View><Text style={s.name}>ZERO</Text><Text style={s.tag}>PIN. PRIVATE. TEMPORARY. GONE.</Text></View></View>
   <View style={s.lock}><Text style={s.lockText}>PRIVATE MESSAGING</Text></View>
   <Text style={s.title}>Your privacy deserves a real connection.</Text>
   <Text style={s.copy}>ZERO messaging is not yet available on this build. Simulated conversations and local-only message sending have been removed. Verified authentication and encrypted messaging are required before access can open.</Text>
   <View style={s.warning}><Text style={s.warningText}>{message}</Text></View>
   <Pressable accessibilityRole="button" disabled={checking} onPress={check} style={s.button}>{checking?<ActivityIndicator color="#1b080e"/>:<Text style={s.buttonText}>Check service connection</Text>}</Pressable>
   <Text style={s.note}>A service health check does not verify end-to-end encryption or account security.</Text>
 </View></SafeAreaView>
}
const s=StyleSheet.create({
 root:{flex:1,justifyContent:"center",padding:20,backgroundColor:"#090607"},
 card:{padding:24,borderWidth:1,borderColor:"#5c2230",borderRadius:24,backgroundColor:"#1b0d13"},
 brand:{flexDirection:"row",alignItems:"center",gap:12},mark:{width:48,height:48,borderRadius:24,borderWidth:3,borderColor:"#ff4359",alignItems:"center",justifyContent:"center"},markText:{fontSize:20,fontWeight:"900",color:"#ff4359"},name:{color:"#fff",fontSize:24,fontWeight:"900",letterSpacing:4},tag:{color:"#bba6ae",fontSize:8,letterSpacing:1},
 lock:{marginTop:42,alignSelf:"flex-start",padding:10,borderRadius:10,backgroundColor:"#401623"},lockText:{color:"#ff8897",fontSize:10,fontWeight:"900",letterSpacing:1},
 title:{fontSize:33,fontWeight:"900",color:"#fff",lineHeight:39,marginTop:18},copy:{color:"#c8b5bc",fontSize:14,lineHeight:22,marginTop:16},warning:{padding:16,borderRadius:14,borderWidth:1,borderColor:"#692a3b",backgroundColor:"#2b111b",marginTop:24},warningText:{color:"#edb6c1",fontSize:13,lineHeight:20},button:{minHeight:52,borderRadius:14,backgroundColor:"#ff4359",marginTop:20,alignItems:"center",justifyContent:"center"},buttonText:{fontWeight:"900",color:"#1b080e"},note:{fontSize:11,lineHeight:16,color:"#aa939d",marginTop:18}
});
