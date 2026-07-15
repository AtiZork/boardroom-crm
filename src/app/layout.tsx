import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { CrmProvider } from "@/lib/store";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Boardroom — Multi-Brand CRM Demo",
  description:
    "Interactive MVP: four-brand isolation, lead stages, automatic Client IDs, inverted cross-sell search, and dashboards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body
        style={
          {
            ["--font-display" as string]: "var(--font-fraunces), Georgia, serif",
            ["--font-body" as string]: "var(--font-manrope), system-ui, sans-serif",
          } as React.CSSProperties
        }
      >
        <CrmProvider>{children}</CrmProvider>
      </body>
    </html>
  );
}
