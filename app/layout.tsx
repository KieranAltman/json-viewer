import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "JSON Viewer - Online JSON Formatter & Visualizer",
  description:
    "Free online JSON viewer with formatting, minification, tree visualization, search filtering, and path copying. Supports file drag-and-drop and URL loading for large JSON data.",
  keywords: [
    "JSON Viewer",
    "JSON formatter",
    "JSON prettifier",
    "JSON tree viewer",
    "JSON validator",
    "JSON minifier",
    "JSON beautifier",
    "JSON online tool",
    "JSON parser",
    "JSON explorer",
  ],
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "JSON Viewer - Online JSON Formatter & Visualizer",
    description:
      "Free online JSON viewer with formatting, minification, tree visualization, and search filtering. Supports file drag-and-drop and URL loading.",
    type: "website",
  },
}

const geistHeading = Geist({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable, geistHeading.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
