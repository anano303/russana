import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
// import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/modules/cart/context/cart-context";
import { CheckoutProvider } from "@/modules/checkout/context/checkout-context";
import { satoshi } from "./(pages)/fonts";
import Footer from "@/components/footer/footer";
import { LanguageProvider } from "@/hooks/LanguageContext";
import Header from "@/components/header/header";
import SiteTimer from "@/components/SiteTimer/SiteTimer";
import ChatButton from "@/components/chat-button/chat-button";
// import { LandingPage } from "./(pages)/landingPage/LandingPage";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_CLIENT_URL || "https://russana.ge"
  ),
  title: "Russana",
  description: "Russana - დააპიპინეეეეეე",
  openGraph: {
    type: "website",
    locale: "ka_GE",
    url: "https://russana.ge/",
    siteName: "Russana",
    title: "Russana",
    images: [
      {
        url: "/van%20gog.jpg",
        width: 1200,
        height: 630,
        alt: "Russana Sharing Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Russana",
    description: "Russana - შეიძინე და აპიპინეეეე.",
    images: ["/van%20gog.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Facebook SDK */}
        <script
          async
          defer
          crossOrigin="anonymous"
          src={`https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v13.0&appid=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}&autoLogAppEvents=1`}
        />
        {/* Remove the problematic prefetch links */}
      </head>
      <body
        className={`${satoshi.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* <LandingPage /> */}
        <Providers>
          <AuthProvider>
            <CartProvider>
              <CheckoutProvider>
                <LanguageProvider>
                  <SiteTimer />
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <ChatButton />
                </LanguageProvider>
              </CheckoutProvider>
            </CartProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
