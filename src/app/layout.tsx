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
  title: "AI Prompt Battle 2026 — SJBIT Vigyantra",
  description:
    "Compete in the ultimate AI Prompt Battle at SJBIT Vigyantra 2026. Think. Prompt. Create. 30 October 2026 · SJBIT, Bengaluru · ₹50,000 Prize Pool.",
  keywords: [
    "AI Prompt Battle", "Vigyantra 2026", "SJBIT", "AI competition",
    "prompt engineering", "Bengaluru tech fest", "AI hackathon",
  ],
  openGraph: {
    title: "AI Prompt Battle 2026 — SJBIT Vigyantra",
    description:
      "Compete in the ultimate AI Prompt Battle. Think. Prompt. Create. 30 Oct 2026 · SJBIT, Bengaluru · ₹50,000 Prize Pool.",
    url: "https://aipromptbattle.sjbit.edu.in",
    siteName: "AI Prompt Battle 2026",
    images: [
      {
        url: "https://res.cloudinary.com/zp0ionc0/image/upload/f_auto,q_auto/WhatsApp_Image_2026-09-12_at_11.56.57_AM",
        width: 1200,
        height: 630,
        alt: "AI Prompt Battle 2026 — SJBIT Vigyantra",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Prompt Battle 2026 — SJBIT Vigyantra",
    description:
      "Compete in the ultimate AI Prompt Battle. 30 Oct 2026 · SJBIT, Bengaluru · ₹50,000 Prize Pool.",
    images: ["https://res.cloudinary.com/zp0ionc0/image/upload/f_auto,q_auto/WhatsApp_Image_2026-09-12_at_11.56.57_AM"],
  },
  metadataBase: new URL("https://aipromptbattle.sjbit.edu.in"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
