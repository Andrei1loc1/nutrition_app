import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/layout/ClientWrapper";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeuroSnap Vision",
  description: "AI-powered nutrition tracking app",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/leaf.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#22c55e" },
    { media: "(prefers-color-scheme: dark)", color: "#22c55e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
    <body className={`${plusJakarta.className}`}>
      <main className="mx-auto w-full max-w-[430px] pb-20 min-h-screen bg-gradient-to-br from-[#F7FBF9] via-[#EAF7F1] to-[#DFF3EA]">
        <ClientWrapper>{children}</ClientWrapper>
      </main>
    </body>
    </html>
  );
}