import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SpaceShare Admin Dashboard",
    template: "%s | SpaceShare Admin",
  },
  description: "SpaceShare Admin Dashboard — manage users, listings, bookings, payouts, and disputes.",
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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <QueryProvider>
          {children}
          {/* Sonner toaster host: required for `toast.success()`, `toast.error()` etc. to actually render anywhere in the app */}
          <Toaster
            position="top-right"
            closeButton
            richColors
            toastOptions={{
              classNames: {
                toast:
                  "md:rounded-2xl !rounded-xl md:shadow-[0_12px_40px_-12px_rgba(15,23,42,0.25)] border-border/70",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
