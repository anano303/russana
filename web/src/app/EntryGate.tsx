"use client";

import { useState } from "react";
import MovingImages from "../components/firstPage/MovingImages";
import { Providers } from "@/app/providers";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/modules/cart/context/cart-context";
import { CheckoutProvider } from "@/modules/checkout/context/checkout-context";
import { LanguageProvider } from "@/hooks/LanguageContext";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import SiteTimer from "@/components/SiteTimer/SiteTimer";
import ChatButton from "@/components/chat-button/chat-button";
import HomePagesHead from "@/components/homePagesHead/homePagesHead";
import HomePageShop from "@/components/homePageShop/homePageShop";
import TopItems from "@/components/TopItems/TopItems";
import PinkCharacter from "@/components/PinkCharacter/PinkCharacter";

const EntryGate = () => {
  const [showSite, setShowSite] = useState(false);

  return (
    <>
      {!showSite ? (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black text-white">
          <MovingImages />
         <button className="entry-button" onClick={() => setShowSite(true)}>
  საიტზე შესვლა
</button>
        </div>
      ) : (
        <Providers>
          <AuthProvider>
            <CartProvider>
              <CheckoutProvider>
                <LanguageProvider>
                  <SiteTimer />
                  <Header />
                  <main className="flex-1">
                    <HomePagesHead />
                    <TopItems />
                    <div
                      className="site-timer-container"
                      style={{ position: "relative", zIndex: 20 }}
                    >
                      {/* აქ შეგიძლიათ დაამატოთ დამატებითი კოდი */}
                    </div>
                    <HomePageShop />
                    <PinkCharacter />
                  </main>
                  <Footer />
                  <ChatButton />
                </LanguageProvider>
              </CheckoutProvider>
            </CartProvider>
          </AuthProvider>
        </Providers>
      )}
    </>
  );
};

export default EntryGate;
