'use client';

import React, { useState, useRef, useEffect } from 'react';
import './beep.css';

interface BeepProps {
  soundSrc: string;
  shape?: 'heart' | 'star'; // არჩევითია, default არის 'heart'
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  emoji: string;
}

const Beep: React.FC<BeepProps> = ({ soundSrc, shape = 'heart' }) => {
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

  const emojis = ['🎵', '🎶', '💖', '✨', '🎧'];

  useEffect(() => {
    setIsClient(true);
    const storedBest = localStorage.getItem('bestScore');
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
            localStorage.setItem('bestScore', score.toString());
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

  if (!isClient) return null;

  return (
    <div className="beep-container">
      <div className="best-score">🏆 {bestScore}</div>

      {shape === 'heart' && (
        <div className={`heart ${pressed ? 'pressed' : ''}`} onClick={handleClick}></div>
      )}
      {shape === 'star' && (
        <div className={`star ${pressed ? 'pressed' : ''}`} onClick={handleClick}></div>
      )}

      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const translateX = Math.cos(rad) * p.distance;
        const translateY = Math.sin(rad) * p.distance;
        return (
          <span
            key={p.id}
            className="particle"
            style={{
              transform: `translate(0,0)`,
              animation: `flyOut 1.8s forwards`,
              '--translateX': `${translateX}px`,
              '--translateY': `${translateY}px`,
            } as React.CSSProperties}
          >
            {p.emoji}
          </span>
        );
      })}

      <div className="scoreboard">
        <div>⏰ {timeLeft}</div>
        <div>🔥 {score}</div>
      </div>

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
