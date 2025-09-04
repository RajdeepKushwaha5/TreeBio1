import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import { ThemeProvider } from "@/components/theme-provider";
import { SmartRealtimeProvider } from "@/components/smart-realtime-provider";
import { Toaster } from "sonner";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "TreeBio - Modern Bio Link Platform",
  description: "TreeBio - Create beautiful, customizable bio link pages with analytics, QR codes, URL shortening, and more. The modern alternative to traditional link-in-bio services.",
  keywords: ["bio link", "link in bio", "social media", "profile links", "digital presence", "url shortener", "qr codes"],
  authors: [{ name: "Rajdeep Kushwaha", url: "https://github.com/RajdeepKushwaha5" }],
  creator: "Rajdeep Kushwaha",
  publisher: "TreeBio",
  metadataBase: new URL("https://treebio1.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TreeBio - Modern Bio Link Platform",
    description: "Create beautiful, customizable bio link pages with analytics, QR codes, and more.",
    url: "https://treebio1.vercel.app",
    siteName: "TreeBio",
    type: "website",
    images: [
      {
        url: "/favicon.svg",
        width: 100,
        height: 100,
        alt: "TreeBio Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TreeBio - Modern Bio Link Platform",
    description: "Create beautiful, customizable bio link pages with analytics, QR codes, and more.",
    creator: "@rajdeeptwts",
    images: ["/favicon.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_cmVzdGVkLWRyYWtlLTkzLmNsZXJrLmFjY291bnRzLmRldiQ"}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body className={`${poppins.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SmartRealtimeProvider>
              <Toaster />
              {children}
            </SmartRealtimeProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
