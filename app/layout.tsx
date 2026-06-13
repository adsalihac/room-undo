import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "RoomUndo — Find rooms around you",
  description: "Discover rooms, PGs, hostels, and shared accommodations on an interactive map.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="h-full w-full overflow-hidden flex flex-col text-primary-text font-sans">
        {children}
      </body>
    </html>
  );
}
