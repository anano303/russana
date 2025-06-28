"use client";

import { useRouter } from "next/navigation";
import MovingImages from "../components/firstPage/MovingImages";
import "./entry-page.css";

const EntryGate = () => {
  const router = useRouter();

  // Handle entry to the main site
  const handleEnterSite = () => {
    router.push("/home");
  };

  return (
    <div className="entry-page relative w-full h-screen flex flex-col items-center justify-center bg-black text-white">
      <MovingImages />
      <button className="entry-button" onClick={handleEnterSite}>
        ჯერ დააპიპინე 🎶👇,   მერე  შედი 👣
      </button>
    </div>
  );
};

export default EntryGate;
