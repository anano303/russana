'use client';

import React from 'react';
import './FlyingHeartWithWings.css';
import Image from 'next/image';

interface FlyingHeartWithWingsProps {
  size?: number;
}

const FlyingHeartWithWings: React.FC<FlyingHeartWithWingsProps> = ({
  size = 120,
}) => {
  const heartSize = size;
  const wingSize = size * 0.8;

  return (
    <div
      className="heart-container"
      style={{ width: heartSize, height: heartSize }}
    >
      <div className="heart2" />

      <div
        className="wing left-wing flapping"
        style={{ width: wingSize, height: wingSize }}
      >
        <Image src="/wing.png" alt="left wing" fill style={{ objectFit: 'contain' }} />
      </div>

      <div
        className="wing right-wing flapping"
        style={{ width: wingSize, height: wingSize }}
      >
        <Image
          src="/wing.png"
          alt="right wing"
          fill
          style={{ objectFit: 'contain', transform: 'scaleX(-1)' }}
        />
      </div>
    </div>
  );
};

export default FlyingHeartWithWings;
