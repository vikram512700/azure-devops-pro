import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { getDocsNavigation } from "@/lib/docs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Azure DevOps & AI Pro",
  description: "Master Azure DevOps, SRE, and Production Architecture with AI Mentorship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const docsNavigation = getDocsNavigation();

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground`}>
        <Navbar docsNavigation={docsNavigation} />
        {children}
      </body>
    </html>
  );
}
