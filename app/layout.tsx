import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "pannellum/build/pannellum.css";
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
  title: "Tur Virtual 360° | Perpustakaan Kominfo",
  description:
    "Jelajahi setiap sudut Perpustakaan Kominfo melalui pengalaman panorama 360° yang interaktif.",
  icons: {
    icon: [
      {
        url: "/images/logo-sulawesi-tenggara.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/images/logo-sulawesi-tenggara.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
