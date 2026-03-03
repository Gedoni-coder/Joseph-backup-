import React from "react";
import { Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpeedometerProps {
  value: number; // 0-100
  label?: string;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export function Speedometer({ value, label, size = "md", showValue = true }: SpeedometerProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const angle = (clampedValue / 100) * 180 - 90; // Map 0-100 to -90 to 90 degrees

  // Determine color based on value
  let color = "text-red-600";
  let bgColor = "from-red-50 to-rose-50";
  let textColor = "text-red-700";
  let status = "Critical";

  if (clampedValue >= 60) {
    color = "text-green-600";
    bgColor = "from-green-50 to-emerald-50";
    textColor = "text-green-700";
    status = "Excellent";
  } else if (clampedValue >= 40) {
    color = "text-yellow-600";
    bgColor = "from-yellow-50 to-amber-50";
    textColor = "text-yellow-700";
    status = "Fair";
  }

  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  const iconSize = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn(`bg-gradient-to-br ${bgColor} border-2 rounded-2xl p-6 flex flex-col items-center justify-center`, size === "sm" ? "border-red-100" : "border-yellow-100")}>
      <div className={cn(sizeClasses[size], "relative flex items-center justify-center")}>
        {/* SVG Speedometer */}
        <svg className="w-full h-full" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet">
          {/* Background arc */}
          <defs>
            <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>

          {/* Track arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Gradient arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            stroke="url(#speedGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${(clampedValue / 100) * 251.2} 251.2`}
          />

          {/* Needle */}
          <g>
            <line x1="100" y1="100" x2={100 + 60 * Math.cos((angle * Math.PI) / 180)} y2={100 + 60 * Math.sin((angle * Math.PI) / 180)} stroke={color} strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="100" r="6" fill={color} />
          </g>

          {/* Labels */}
          <text x="30" y="115" fontSize="10" fill="#6b7280" fontWeight="bold">
            0
          </text>
          <text x="100" y="20" fontSize="10" fill="#6b7280" fontWeight="bold" textAnchor="middle">
            50
          </text>
          <text x="170" y="115" fontSize="10" fill="#6b7280" fontWeight="bold">
            100
          </text>
        </svg>

        {/* Center value display */}
        <div className="absolute flex flex-col items-center">
          <Gauge className={cn(iconSize[size], color)} />
        </div>
      </div>

      {/* Display info below */}
      {showValue && (
        <div className="mt-4 text-center">
          <div className={cn("text-3xl font-black", textColor)}>{clampedValue}</div>
          <div className={cn("text-xs font-bold uppercase", textColor)}>{status}</div>
          {label && <div className="text-xs text-muted-foreground mt-1">{label}</div>}
        </div>
      )}
    </div>
  );
}
