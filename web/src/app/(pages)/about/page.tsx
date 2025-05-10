"use client";

import Link from "next/link";
import "./about.css";
import { useLanguage } from "@/hooks/LanguageContext";
import Beep from "../../../components/beep/beep";
import FlyingHeartWithWings from "@/components/flyingHeartWithWings/FlyingHeartWithWings";

export default function AboutPage() {
  const { t } = useLanguage();

  const soundPath = "_button-beep-2.wav";
  const soundPath2 = "beep.wav";

  return (
    <div className="about-container">
      <h1 className="about-title">{t("about.title")}</h1>
      <Beep soundSrc={soundPath} shape="heart" />
      <Beep soundSrc={soundPath2} shape="star" />

      <FlyingHeartWithWings size={200}  />
    
    </div>
  );
}
