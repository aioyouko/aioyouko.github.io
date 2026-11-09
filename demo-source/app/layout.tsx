import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Kanatzidis Research Group | Northwestern University",
  icons: { icon: "/kanatzidis-demo/favicon.svg" },
  description:
    "Solid-state materials chemistry at Northwestern University: exploratory synthesis, thermoelectrics, halide perovskites and radiation detection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head><link rel="preconnect" href="https://common.northwestern.edu" crossOrigin="anonymous" /></head>
      <body><aside className="demo-preview" aria-label="Website preview"><div><strong>Preview · For feedback</strong><span>Kanatzidis Group website demo</span></div><nav aria-label="Preview links"><a href="https://aioyouko.github.io/#current-work">Chen’s homepage</a><a href="mailto:heyang.chen@northwestern.edu?subject=Kanatzidis%20website%20demo%20feedback">Share feedback ↗</a></nav></aside>{children}</body>
    </html>
  );
}
