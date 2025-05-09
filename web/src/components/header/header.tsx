"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/Images/Layer_1.png";
import { CartIcon } from "@/modules/cart/components/cart-icon";
import "./header.scss";
import UserMenu from "./user-menu";
import { LanguageSwitcher } from "@/components/language-switcher/language-switcher";
import { useLanguage } from "@/hooks/LanguageContext";
import { Home, ShoppingBag, Star } from "lucide-react";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { t } = useLanguage();

  const toggleNav = () => {
    setIsNavOpen((prevState) => !prevState);
  };

  return (
    <header
      className={`header wireframe-style ${
        isNavOpen ? "mobile-nav-active" : ""
      }`}
    >
      <div className="header-container">
        <nav className="main-nav">
          <ul>
            <li>
              <Link href="/" className="nav-link">
                <Home size={16} className="nav-icon" />
                <span>{t("navigation.home")}</span>
              </Link>
            </li>
            <li>
              <Link
                href="/shop?page=1&mainCategory=paintings"
                className="nav-link"
              >
                <ShoppingBag size={16} className="nav-icon" />
                <span>{t("navigation.shop")}</span>
              </Link>
            </li>
            <li>
              <Link href="/about" className="nav-link">
                <Star size={16} className="nav-icon" />
                <span>{t("navigation.about")}</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="logo-container">
          <Link href="/">
            <Image
              src={logo}
              width={125}
              height={80}
              alt="Russana logo"
              className="header-logo"
            />
          </Link>
        </div>

        <div className="user-actions">
          <div className="user-menu">
            <UserMenu />
          </div>
          <CartIcon />
          <div className="language-switcher-container">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Toggle */}
      <div className="mobile-nav-btn" onClick={toggleNav}>
        <span className={`hamburger-icon ${isNavOpen ? "close" : ""}`}>
          {isNavOpen ? "×" : "☰"}
        </span>
      </div>
    </header>
  );
}
