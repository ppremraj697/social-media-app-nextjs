import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider >
      <html lang="en">
        <body className="min-h-screen flex flex-col">

          <Toaster position="bottom-left" />

          <header className="border-b sticky top-0 bg-white z-50">
            <Header />
          </header>

          <div className="bg-[#F4F2ED] flex-1 w-full">
            <main className="max-w-6xl mx-auto">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
