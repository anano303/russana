"use client";

import { useLanguage } from "@/hooks/LanguageContext";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import "./language-switcher.css";
import { Globe } from "lucide-react";
import lang from "../../assets/icons/lang.png";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        switcherRef.current &&
        !switcherRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="language-switcher" ref={switcherRef}>
      <button className="language-button" onClick={toggleDropdown}>
        <Image src={lang} alt="language" />
        {language === "en" ? "ENG" : "ქარ"}
      </button>

      {isOpen && (
        <div className="language-dropdown">
          <button
            className={`language-option ${language === "ge" ? "active" : ""}`}
            onClick={() => setLanguage("ge")}
          >
            ქარ
          </button>
          <button
            className={`language-option ${language === "en" ? "active" : ""}`}
            onClick={() => setLanguage("en")}
          >
            ENG
          </button>
        </div>
      )}
    </div>
  );
}
