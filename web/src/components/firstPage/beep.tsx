'use client';

import React, { useRef, useState } from 'react';
import './beep.css';

interface BeepProps {
  soundSrc: string;
  shape?: 'heart' | 'star';
  color?: string;
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  emoji: string;
}

const Beep: React.FC<BeepProps> = ({ soundSrc, shape = 'heart', color = 'red' }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [pressed, setPressed] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const emojis = ['🎵', '🎶', '💖', '✨', '🎧'];

  const handlePress = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    setPressed(true);
    setTimeout(() => setPressed(false), 150);

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

  return (
    <div className="beep-container">
      {shape === 'heart' && (
        <div
          className={`heart ${pressed ? 'pressed' : ''}`}
          style={{ backgroundColor: color }}
          onMouseDown={handlePress}
          onTouchStart={handlePress}
        ></div>
      )}
      {shape === 'star' && (
        <div
          className={`star ${pressed ? 'pressed' : ''}`}
          style={{ background: color }}
          onMouseDown={handlePress}
          onTouchStart={handlePress}
        ></div>
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

      <audio ref={audioRef} src={soundSrc} />
    </div>
  );
};

export default Beep;
