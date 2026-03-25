import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DESTANE | Own the Stories You Believe In",
  description:
    "AI-powered film production meets blockchain-based fan ownership. Invest in individual titles and share in global revenue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface antialiased selection:bg-primary/30 min-h-screen">
        {children}
      </body>
    </html>
  );
}
