import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata:Metadata={
 title:"ZERO | PIN. PRIVATE. TEMPORARY. GONE.",
 description:"Privacy-first temporary encrypted communications.",
 applicationName:"ZERO",
 manifest:"/manifest.webmanifest",
 icons:{icon:"/zero-mark.svg"},
 openGraph:{title:"ZERO Private Messaging",description:"PIN. PRIVATE. TEMPORARY. GONE.",type:"website",siteName:"ZERO"},
 twitter:{card:"summary",title:"ZERO Private Messaging",description:"PIN. PRIVATE. TEMPORARY. GONE."}
};
export const viewport:Viewport={themeColor:"#090c10",colorScheme:"dark"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
