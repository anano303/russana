"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import "./PinkCharacter.css";

const PinkCharacter: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnimationClick = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1500); // Reset after animation completes
    }
  };

  return (
    <div className="pink-character-wrapper">
    <section className="pink-character-section">
      <div className="pink-character-container">
        <div className="pink-character-message">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pink-character-title"
          >
            ახლა მოდაშია პიპინა ჩანთები! 
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pink-character-subtitle"
          >
            პიიიიიიიიიპ!!!
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              href="/products/category/bags"
              className="pink-character-button"
            >
              შეუკვეთე ახლავე
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="pink-character-image-container"
          animate={
            isAnimating
              ? {
                  y: [0, -20, 0],
                  rotate: [0, 5, 0, -5, 0],
                }
              : {}
          }
          transition={
            isAnimating
              ? {
                  duration: 1.5,
                  ease: "easeInOut",
                }
              : {}
          }
          onClick={handleAnimationClick}
        >
          <Image
            src="/მართკუთხედა.png"
            alt="Pink character with bag"
            width={400}
            height={600}
            className="pink-character-image"
            priority
          />
        </motion.div>
      </div>
    </section>
    </div>
  );
};

export default PinkCharacter;
