import type {Metadata} from "next";import "./globals.css";
export const metadata:Metadata={title:"ZERO — PIN. PRIVATE. TEMPORARY. GONE.",description:"Privacy-first encrypted communications."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}