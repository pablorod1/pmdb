import React from "react";

interface Props {
  percentage: number;
  size?: number;
}

export const ProgressSpinner: React.FC<Props> = (props) => {
  const { percentage, size = 100 } = props;
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (percentage / 100) * circumference;

  function getColor(percent: number): string {
    if (percent <= 33) {
      return `rgb(255, ${Math.round(percent * 7.72)}, 0)`;
    } else if (percent <= 66) {
      return `rgb(${Math.round(255 - (percent - 33) * 7.72)}, 255, 0)`;
    } else {
      return `rgb(0, 255, ${Math.round((percent - 66) * 7.72)})`;
    }
  }

  const arcColor = getColor(percentage);

  function updateGauge(gauge: any, percentage: number) {
    const circle = gauge.querySelector("circle:nth-child(3)");
    const text = gauge.querySelector("text");
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const progress = (percentage / 100) * circumference;

    circle.style.strokeDasharray = `${progress} ${circumference}`;
    text.textContent = `${percentage}%`;

    function getColor(percent: number) {
      if (percent <= 33) {
        return `rgb(255, ${Math.round(percent * 7.72)}, 0)`;
      } else if (percent <= 66) {
        return `rgb(${Math.round(255 - (percent - 33) * 7.72)}, 255, 0)`;
      } else {
        return `rgb(0, 255, ${Math.round((percent - 66) * 7.72)})`;
      }
    }

    circle.style.stroke = getColor(percentage);
  }

  document.querySelectorAll(".percentage-gauge").forEach((gauge: any) => {
    const percentage = parseInt(gauge.querySelector("text").textContent);
    updateGauge(gauge, percentage);
  });

  return (
    <div
      className="percentage-gauge bg-[#1a1c1e] rounded-full inline-block"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="#1a1c1e" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth / 2}
          fill="none"
          stroke="#2c2f33"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth / 2}
          fill="none"
          stroke={arcColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${progress} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeLinecap="round"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize={`${size * 0.26}px`}
          fill="white"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          {percentage}%
        </text>
      </svg>
    </div>
  );
};
