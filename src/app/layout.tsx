import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Pintu Berkah — Manajemen Kos Modern",
    template: "%s | Pintu Berkah",
  },
  description:
    "Platform manajemen kos-kosan all-in-one. Kelola kamar, penyewa, pembayaran, dan bangun website booking properti Anda dengan mudah.",
  keywords: ["kos", "kosan", "manajemen properti", "booking kamar", "indekos"],
  authors: [{ name: "Pintu Berkah" }],
  creator: "Pintu Berkah",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
