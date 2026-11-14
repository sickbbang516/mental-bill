import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "INVOICE SYSTEM | Statement of Account",
  description: "Parody Statement of Account & Virtual Invoice Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7345794387970448"
     crossorigin="anonymous"></script>
      </head>
      <body className="antialiased bg-[#E5E5E5] text-[#111111]">
        {children}
      </body>
    </html>
  );
}