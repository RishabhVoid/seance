import type { Metadata } from "next";
import { EB_Garamond, IM_Fell_English, Special_Elite, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const serif = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const display = IM_Fell_English({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const type = Special_Elite({
  variable: "--font-type",
  subsets: ["latin"],
  weight: ["400"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "séance — speak with the dead languages",
  description:
    "Summon the ghost of a long-dead programming language. Runs locally on Gemma. Your conversations with the dead never leave your machine.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${display.variable} ${type.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
