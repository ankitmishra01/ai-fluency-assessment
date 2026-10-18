import type { Metadata, Viewport } from "next";
import { Footer, Header } from "./chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Fluency Assessment",
  description:
    "A four-dimension AI fluency assessment scored out of 800. Prototype on a pilot item bank; scoring bands are illustrative and not psychometrically validated.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
