import React from 'react';

export function SmokeEffect() {
  return (
    <div className="fixed inset-x-0 bottom-0 h-screen pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="smoke-particle absolute bottom-0 w-40 h-40 bg-white/20 rounded-full blur-xl"
          style={{
            left: `${(i * 100/12)}%`,
            animation: `float ${5 + i * 0.5}s ease-in infinite`,
            animationDelay: `${i * 0.3}s`,
            opacity: 0
          }}
        />
      ))}
    </div>
  );
}