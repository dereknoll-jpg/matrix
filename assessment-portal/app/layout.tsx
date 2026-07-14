import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Field Services IT Skill Assessment",
  description: "A web-based assessment and scoring matrix for field services and service desk IT teams.",
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
