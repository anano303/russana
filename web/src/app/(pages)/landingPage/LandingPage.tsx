"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Heart } from "lucide-react";
import "./LandingPage.css";
import Beep from "@/components/beep/beep";
import FlyingHeartWithWings from "@/components/flyingHeartWithWings/FlyingHeartWithWings";

interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  hue: number;
}

export function LandingPage() {
  const [showScroll, setShowScroll] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const soundPath = "_button-beep-2.wav";
  const soundPath2 = "beep.wav";

  // Create 3D particles for depth effect
  useEffect(() => {
    const particleCount = 100;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100, // % position
        y: Math.random() * 100,
        z: Math.random() * 1000 - 800, // Random depth between -800 and 200
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.5 + 0.1,
        hue: Math.random() * 20 + 340, // Pink hues
      });
    }

    setParticles(newParticles);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 2) {
        setShowScroll(false);
      } else {
        setShowScroll(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing-container" ref={containerRef}>
      {/* 3D Particles */}
      <div className="landing-particle-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="landing-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              backgroundColor: `hsla(${particle.hue}, 95%, 65%, ${
                particle.opacity * 2
              })`,
              transform: `translateZ(${particle.z}px)`,
              boxShadow: `0 0 ${particle.size * 2}px hsla(${
                particle.hue
              }, 95%, 75%, 0.8)`,
            }}
          />
        ))}
      </div>

      <div className="landing-content">
        <motion.div className="landing-text">
          <div className="landing-contents">
            <Beep soundSrc={soundPath} shape="heart" />
            <Beep soundSrc={soundPath2} shape="star" />
          </div>
          <div className="landing-contents-logo">
            <FlyingHeartWithWings size={200} />
          </div>
          <div className="landing-contents">
            <Beep soundSrc={soundPath2} shape="star2" />
            <Beep soundSrc={soundPath} shape="heart2" />
          </div>
        </motion.div>
      </div>

      {showScroll && (
        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          onClick={scrollToContent}
        >
          <p>ჩამოსქროლე</p>
          <ChevronDown size={24} className="scroll-icon" />
          <Heart
            size={14}
            className="scroll-heart"
            fill="#e91e63"
            color="#e91e63"
          />
        </motion.div>
      )}
    </div>
  );
}
