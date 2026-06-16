import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const title = "Microinteractions — Fine-tuned UI Interactions";
const description =
  "A showcase of smooth, multi-step microinteractions with live demos and copy-paste code in React and vanilla HTML/CSS/JS.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-bg font-sans text-text antialiased">
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
        <Analytics />
      </body>
    </html>
  );
}
