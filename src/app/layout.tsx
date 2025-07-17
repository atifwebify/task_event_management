import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { EventsProvider } from "@/context/EventsContext";
import { Toaster } from "@/components/ui/sonner";

const soraSans = Sora({
  variable: "--font-sora",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event Manager",
  description: "Event Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${soraSans.variable} antialiased`}
      >
        <AuthProvider>
          <EventsProvider>
            <Toaster position="top-center" />
            {children}
          </EventsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
