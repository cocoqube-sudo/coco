import type { Metadata, Viewport } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SiteInteractivity from "@/components/SiteInteractivity";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#063923",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://cocoqube.com"),
  title: {
    default: "Cocoqube | Coco Peat & Coir Products Supplier Bengaluru, India",
    template: "%s | Cocoqube",
  },
  description: "Bengaluru supplier of coco peat and coir products for growers, nurseries, garden brands and importers, quoted by grade and spec, with export from India.",
  icons: {
    icon: [
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cocoqube.com",
    siteName: "Cocoqube",
    title: "Cocoqube | Coco Peat & Coir Products Supplier Bengaluru, India",
    description: "Bengaluru supplier of coco peat and coir products for growers, nurseries, garden brands and importers, quoted by grade and spec, with export from India.",
    images: [{ url: "/images/og/index.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cocoqube | Coco Peat & Coir Products Supplier Bengaluru, India",
    description: "Bengaluru supplier of coco peat and coir products for growers, nurseries, garden brands and importers, quoted by grade and spec, with export from India.",
    images: ["/images/og/index.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Navbar />
        {children}
        <Footer />
        <WhatsAppFloat />
        <SiteInteractivity />
      </body>
    </html>
  );
}
