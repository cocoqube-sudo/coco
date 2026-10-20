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
  title: "Coco Peat and Coir Supplier in Bengaluru | Cocoqube",
  description: "Bengaluru supplier of coco peat and coir products for growers, nurseries, garden brands and importers, quoted by grade and spec, with export from India.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Coco Peat and Coir Supplier in Bengaluru | Cocoqube",
    description: "Bengaluru supplier of coco peat and coir products for growers, nurseries, garden brands and importers, quoted by grade and spec, with export from India.",
    images: [{ url: "https://cocoqube.com/images/og/index.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coco Peat and Coir Supplier in Bengaluru | Cocoqube",
    description: "Bengaluru supplier of coco peat and coir products for growers, nurseries, garden brands and importers, quoted by grade and spec, with export from India.",
    images: ["https://cocoqube.com/images/og/index.jpg"],
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
