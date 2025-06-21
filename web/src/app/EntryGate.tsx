"use client";

import { useState } from "react";
import MovingImages from "../components/firstPage/MovingImages";

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
        <div className="main-content">
          <HomePagesHead />

          <TopItems />
          {/* <HomePageAds /> */}
          <div
            className="site-timer-container"
            style={{ position: "relative", zIndex: 20 }}
          >
            {/* ...existing site-timer code... */}
          </div>
          <HomePageShop />
          <PinkCharacter />
        </div>
      )}
    </>
  );
};

export default EntryGate;
