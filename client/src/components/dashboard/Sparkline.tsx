import React from 'react';

interface SparklineProps {
  data?: number[];
  color?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({ data = [10, 15, 12, 18, 25, 20, 30], color = '#14F195' }) => {
  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((val - min) / range) * 80 - 10;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="w-24 h-8 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};
