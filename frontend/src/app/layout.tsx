import type { Metadata } from "next";
import "./globals.css";
import AppWalletProvider from "@/components/AppWalletProvider";
import InteractiveParticleBackground from "@/components/InteractiveParticleBackground"; // NUEVO

export const metadata: Metadata = {
    title: "Solana dApp - Futurista",
    description: "Next.js + Rust Full Stack",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" suppressHydrationWarning>
        <body suppressHydrationWarning className="antialiased overflow-x-hidden">

        <InteractiveParticleBackground />

        <AppWalletProvider>
            {children}
        </AppWalletProvider>
        </body>
        </html>
    );
}