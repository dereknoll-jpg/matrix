import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Field Services North Assessment",
  description: "Field Services North assessment and team matrix.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
