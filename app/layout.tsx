import type { Metadata } from "next";
import { GeistSans } from "geist/font";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoomUndo — Find rooms around you",
  description: "Discover rooms, PGs, hostels, and shared accommodations on an interactive map.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} h-full antialiased`}
    >
      <body className="h-full w-full overflow-hidden flex flex-col bg-background text-primary-text">{children}</body>
    </html>
  );
}
