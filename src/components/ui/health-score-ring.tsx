import React from "react";

interface HealthScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function HealthScoreRing({ 
  score, 
  size = 140, 
  strokeWidth = 10,
  label = "EXCELLENT",
  className = "" 
}: HealthScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Determine color based on score
  let ringColor = "var(--emerald)";
  if (score < 50) ringColor = "var(--red-critical)";
  else if (score < 75) ringColor = "var(--amber-warn)";

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Background Track */}
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={radius} 
          stroke="hsl(var(--muted))" 
          strokeWidth={strokeWidth} 
          fill="transparent" 
        />
        {/* Progress Ring */}
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={radius} 
          stroke={`hsl(${ringColor})`} 
          strokeWidth={strokeWidth} 
          fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round" 
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Score Text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-extrabold tracking-tight">{score}</span>
        {label && (
          <span className="text-[10px] text-muted-foreground font-semibold mt-0.5 uppercase tracking-wider">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
