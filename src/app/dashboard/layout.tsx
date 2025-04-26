"use client"
import "../globals.css";
import { ReactNode } from "react";
import Sidebar from "@/components/sidebar/sidebar"
import { SessionProvider } from "next-auth/react";


export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <Sidebar />
            {children}
        </SessionProvider>
    );
}
