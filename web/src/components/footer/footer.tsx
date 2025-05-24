"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FacebookIcon, InstagramIcon, MailIcon } from "lucide-react";
import logo from "../../assets/Images/Layer_1.png";
import { useLanguage } from "@/hooks/LanguageContext";
import "./footer.css";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
              {/* <h3 className="footer-heading">{t("footer.quickLinks")}</h3> */}
              <ul className="footer-link-list">
                <li>
                  <Link href="/" className="footer-link">
                    {/* {t("navigation.shop")} */}
                    მთავარი გვერდი
                  </Link>
                </li>
                <li>
                  <Link href="/" className="footer-link">
                    {t("navigation.shop")}
                  </Link>
                </li>
                <li>
                  <Link href="/" className="footer-link">
                    {/* {t("navigation.shop")} */}
                    ჩვენს შესახებ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="">

          <div className="footer-links">
            {/* <div className="footer-column">
              <h3 className="footer-heading">{t("footer.contact")}</h3>
              <address className="footer-contact">
                <p>{t("footer.address")}</p>
                <p>{t("footer.email")}</p>
                <p>{t("footer.phone")}</p>
              </address>
            </div> */}



            <div className="footer-message-logo-container">
              <div className="footer-message-container">
            <p className="footer-message">სანამ წახვალ დააპიპინე ! ! !</p>
            <address className="footer-contact">
              <div className="top-contacts">
                <p>{t("footer.address")}</p>
                <p>{t("footer.email")}</p>
              </div>
              <p className="bottom-contact">{t("footer.phone")}</p>
            </address>
        <div className="footer-social">
          {/* <h3 className="social-title">{t("footer.follow")}</h3> */}
          <div className="social-icons">
            <a href="#" className="social-icon-wrapper" aria-label="Facebook">
              <FacebookIcon 
                className="social-icon facebook-icon" 
                fill="white"
                stroke="#CF0A0A"
                strokeWidth={2}
                style={{
                  backgroundColor: '#CF0A0A',
                  borderRadius: '5px',
                  padding: '2px'
                }}
              />
              <span className="social-name">Facebook</span>
            </a>
            <a href="#" className="social-icon-wrapper" aria-label="Instagram">
              <InstagramIcon 
                className="social-icon" 
                fill="#CF0A0A"
                stroke="white"
                strokeWidth={2}
              />
              <span className="social-name">Instagram</span>
            </a>
            <a href="mailto:your@email.com" className="social-icon-wrapper" aria-label="Email">
              <MailIcon 
                className="social-icon" 
                fill="#CF0A0A"
                stroke="white"
                strokeWidth={2}
              />
              <span className="social-name">Email</span>
            </a>
          </div>
        </div>
            </div>

            <div className="footer-column text-start">
              <div className="footer-logo">          
              <Image
                src={logo}
                alt="Russana Logo"
                width={320}  // გაორმაგებული ზომა
                height={190} // გაორმაგებული ზომა
                className="footer-logo-image"
              /> 
              </div>
              


              <p className="copyright">
                {t("footer.copyright")}
            <a 
              href="https://bestsoft.ge" 
              target="_blank" 
              rel="noopener noreferrer"
              // className="copyright"
            >
              <text className="bestsoft">BESTSOFT.GE</text>
            </a>
            </p>
            </div>
            </div>
          </div>
        </div>



        <div className="footer-bottom">
        </div>
      </div>
    </footer>
  );
}
