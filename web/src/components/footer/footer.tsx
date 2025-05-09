"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Heart } from "lucide-react";
import logo from "../../assets/Images/Layer_1.png";
import { useLanguage } from "@/hooks/LanguageContext";
import "./footer.css";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo">
            <Link href="/">
              <Image
                src={logo}
                alt="Russana Logo"
                width={100}
                height={60}
                className="footer-logo-image"
              />
            </Link>
            <p className="footer-tagline">
              <Heart
                className="heart-icon"
                size={18}
                fill="#e91e63"
                color="#e91e63"
              />
              {t("footer.description")}
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3 className="footer-heading">{t("footer.quickLinks")}</h3>
              <ul className="footer-link-list">
                <li>
                  <Link href="/" className="footer-link">
                    <Heart
                      className="mini-heart"
                      size={12}
                      fill="#e91e63"
                      color="#e91e63"
                    />
                    {t("navigation.home")}
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="footer-link">
                    <Heart
                      className="mini-heart"
                      size={12}
                      fill="#e91e63"
                      color="#e91e63"
                    />
                    {t("navigation.shop")}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="footer-link">
                    <Heart
                      className="mini-heart"
                      size={12}
                      fill="#e91e63"
                      color="#e91e63"
                    />
                    {t("navigation.about")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">{t("footer.contact")}</h3>
              <address className="footer-contact">
                <p>{t("footer.address")}</p>
                <p>{t("footer.email")}</p>
                <p>{t("footer.phone")}</p>
              </address>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">{t("footer.newsletter")}</h3>
              <p className="footer-newsletter-text">
                {t("footer.subscribePrompt")}
              </p>
              <form className="footer-form">
                <input
                  type="email"
                  placeholder={t("footer.emailPlaceholder")}
                  className="footer-input"
                />
                <button type="submit" className="footer-subscribe-btn">
                  {t("footer.subscribe")}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-social">
          <h3 className="social-title">{t("footer.follow")}</h3>
          <div className="social-icons">
            <a href="#" className="social-icon" aria-label="Facebook">
              <Facebook />
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <Instagram />
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <Twitter />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            {t("footer.copyright")}
            <Heart
              className="copyright-heart"
              size={14}
              fill="#e91e63"
              color="#e91e63"
            />
          </p>
        </div>
      </div>
    </footer>
  );
}
