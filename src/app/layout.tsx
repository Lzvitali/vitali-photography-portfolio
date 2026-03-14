import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/public/ThemeProvider";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AdminFloatingButton from "@/components/public/AdminFloatingButton";
import ImageGuard from "@/components/public/ImageGuard";
import { getPortfolioData, getSiteData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Vitali Layzerman | Photography",
  description:
    "Photography portfolio by Vitali Layzerman. Events, portraits, landscapes, street photography and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const portfolio = getPortfolioData();
  const site = getSiteData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <Header
            siteName={site.name}
            categories={portfolio.categories}
          />
          <main className="flex-1 pt-16">{children}</main>
          <Footer name={site.name} contact={site.contact} />
          <AdminFloatingButton />
          <ImageGuard />
        </ThemeProvider>
      </body>
    </html>
  );
}
