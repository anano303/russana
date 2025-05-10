"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './LandingPage.css';
import Beep from '@/components/beep/beep';
import FlyingHeartWithWings from "@/components/flyingHeartWithWings/FlyingHeartWithWings";

export function LandingPage() {
  const [showScroll, setShowScroll] = useState(true);
  const soundPath = "_button-beep-2.wav";
  const soundPath2 = "beep.wav";

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-container">
      <div className="landing-content">
        <motion.div
          className="landing-text"
        >
            <div className="landing-contents">
          <Beep soundSrc={soundPath} shape="heart" />
          <Beep soundSrc={soundPath2} shape="star" />
          </div>
           <div className="landing-contents-logo">
          <FlyingHeartWithWings size={200}  />
          </div>
          <div className="landing-contents">
          <Beep soundSrc={soundPath2} shape="star" />
          <Beep soundSrc={soundPath} shape="heart" />
          </div>


        </motion.div>
        
        {/* აქ შეგიძლიათ დაამატოთ სხვა კომპონენტები */}
        
        {showScroll && (
          <motion.div 
            className="scroll-indicator"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            onClick={scrollToContent}
          >
            <p>ჩამოსქროლე</p>
            <ChevronDown size={24} />
          </motion.div>
        )}
      </div>
    </div>
  );
}