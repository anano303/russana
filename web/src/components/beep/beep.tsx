"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Trophy, Clock, Flame } from "lucide-react";
import "./beep.css";
// Import all heart and star images
import heart from "../../assets/animations/ai-generated-pink-heart-3d-clip-art-free-png.webp";
import heart2 from "../../assets/animations/heart2.png";
import star from "../../assets/animations/star.webp";
import star2 from "../../assets/animations/star3.png";

interface BeepProps {
  soundSrc: string;
  shape?: "heart" | "star" | "heart2" | "star2"; // Updated options
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  emoji: string;
}

const Beep: React.FC<BeepProps> = ({ soundSrc, shape = "heart" }) => {
  const [pressed, setPressed] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerStarted, setTimerStarted] = useState(false);
  const [bestScore, setBestScore] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const emojis = ["🎵", "🎶", "💖", "✨", "🎧"];

  useEffect(() => {
    setIsClient(true);
    const storedBest = localStorage.getItem("bestScore");
    if (storedBest) {
      setBestScore(parseInt(storedBest, 10));
    }
  }, []);

  const handleClick = () => {
    if (timeLeft <= 0) return;

    if (!timerStarted) {
      startTimer();
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    setPressed(true);
    setTimeout(() => setPressed(false), 150);
    setScore((prev) => prev + 1);

    const now = Date.now();
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: now + i,
      angle: Math.random() * 360,
      distance: 100 + Math.random() * 80,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    newParticles.forEach((p) => {
      setTimeout(() => {
        setParticles((prev) => prev.filter((part) => part.id !== p.id));
      }, 1800);
    });
  };

  const startTimer = () => {
    setTimerStarted(true);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setShowResult(true);
          if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem("bestScore", score.toString());
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(20);
    setTimerStarted(false);
    setShowResult(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Function to get the correct image source based on shape
  const getImageSource = () => {
    switch (shape) {
      case "heart":
        return heart;
      case "heart2":
        return heart2;
      case "star":
        return star;
      case "star2":
        return star2;
      default:
        return heart;
    }
  };

  const renderScoreIcons = () => {
    return (
      <div className="scoreboard">
        <div>
          <Clock size={12} style={{ color: "#e91e63" }} /> {timeLeft}
        </div>
        <div>
          <Flame size={12} style={{ color: "#e91e63" }} /> {score}
        </div>
      </div>
    );
  };

  if (!isClient) return null;

  return (
    <div
      className="beep-container"
      style={{
        transform: `perspective(800px) rotateX(${
          Math.sin(Date.now() / 2000) * 5
        }deg) rotateY(${Math.cos(Date.now() / 2000) * 5}deg)`,
      }}
    >
      <div className="best-score">
        <Trophy size={12} style={{ color: "#e91e63" }} />
        {bestScore}
      </div>

      <div
        className={`shape-container ${pressed ? "pressed" : ""}`}
        onClick={handleClick}
      >
        <Image
          src={getImageSource()}
          alt={`Shape ${shape}`}
          width={120}
          height={120}
          className={`shape-image ${shape}-image`}
        />
      </div>

      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const translateX = Math.cos(rad) * p.distance;
        const translateY = Math.sin(rad) * p.distance;
        return (
          <span
            key={p.id}
            className="particle"
            style={
              {
                transform: `translate(0,0)`,
                animation: `flyOut 1.8s forwards`,
                "--translateX": `${translateX}px`,
                "--translateY": `${translateY}px`,
              } as React.CSSProperties
            }
          >
            {p.emoji}
          </span>
        );
      })}

      {/* Updated scoreboard with icons */}
      {renderScoreIcons()}

      {showResult && (
        <div className="result">
          <p>🎉 {score}</p>
          <button onClick={resetGame}>სცადე კიდევ</button>
        </div>
      )}

      <audio ref={audioRef} src={soundSrc} />
    </div>
  );
};

export default Beep;
