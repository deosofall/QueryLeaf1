import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QueryLeaf — AI-Powered PDF Intelligence",
  description:
    "Upload any PDF and instantly chat with it using AI. Get answers, summaries, and insights from your documents in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body className={inter.className}>
            {children}
            <Toaster
              toastOptions={{
                style: {
                  background: "hsl(220, 20%, 10%)",
                  color: "hsl(210, 20%, 92%)",
                  border: "1px solid hsl(220, 16%, 18%)",
                },
              }}
            />
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
