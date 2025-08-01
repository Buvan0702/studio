import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "JusticeForms",
  description: "Digitally manage case forms for police officers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="JusticeForms" />
        <meta
          property="og:description"
          content="Digitally manage case forms for police officers."
        />
        <meta property="og:image" content="/banner.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com" /> {/* Update to real URL */}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="JusticeForms" />
        <meta
          name="twitter:description"
          content="Digitally manage case forms for police officers."
        />
        <meta name="twitter:image" content="/banner.jpg" />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
