"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface HourlyData {
  time: string;
  revenue: number;
}

const MOCK_HOURLY_REVENUE: HourlyData[] = [
  { time: "09:00", revenue: 80000 },
  { time: "11:00", revenue: 150000 },
  { time: "13:00", revenue: 280000 },
  { time: "15:00", revenue: 390000 },
  { time: "17:00", revenue: 650000 },
  { time: "19:00", revenue: 890000 },
  { time: "21:00", revenue: 1250000 }
];

export default function ShiftChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG dimensions
  const width = 600;
  const height = 200;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max value to scale Y axis
  const maxRevenue = 1500000;

  // Compute point coordinates
  const points = MOCK_HOURLY_REVENUE.map((data, idx) => {
    const x = paddingLeft + (idx / (MOCK_HOURLY_REVENUE.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (data.revenue / maxRevenue) * chartHeight;
    return { x, y, data, idx };
  });

  // Construct SVG Path
  const linePath = points.reduce((path, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, "");

  // Area Path (closed shape for gradient fill)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  return (
    <div className="glass-card border border-border-glass/40 bg-background-secondary/30 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-sm font-bold text-text-primary">
            Smena daromad dinamikasi
          </h3>
          <span className="text-[10px] text-text-secondary">Kun davomidagi daromad o&apos;sishi (UZS)</span>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-1 text-[10px] text-text-secondary font-medium">
          <span className="h-2 w-2 rounded-full bg-accent-glow" />
          <span>Jami tushum</span>
        </div>
      </div>

      {/* SVG Frame */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + chartHeight * ratio;
            const value = Math.round(maxRevenue * (1 - ratio));
            return (
              <g key={idx} className="opacity-10">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  fill="#f1f5f9"
                  fontSize="8"
                  textAnchor="end"
                  className="font-mono font-semibold"
                >
                  {(value / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}

          {/* X axis labels */}
          {points.map((p, idx) => (
            <text
              key={idx}
              x={p.x}
              y={paddingTop + chartHeight + 15}
              fill="#94a3b8"
              fontSize="8"
              textAnchor="middle"
              className="opacity-60 font-semibold"
            >
              {p.data.time}
            </text>
          ))}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#areaGlow)" />

          {/* Line Path */}
          <path
            d={linePath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
          />

          {/* Interactive hover points & trigger overlays */}
          {points.map((p, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g key={idx}>
                {/* Visual marker dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 5.5 : 3.5}
                  fill={isHovered ? "#6366f1" : "#0a0e1a"}
                  stroke="#f1f5f9"
                  strokeWidth="1.5"
                  className="transition-all duration-200"
                />
                {/* Large invisible interactive hover zone */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="15"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating HTML Tooltip */}
        {hoveredIdx !== null && (
          <div
            className="absolute bg-background-secondary border border-accent-glow p-2 rounded-lg text-[10px] text-text-primary shadow-xl font-bold font-heading pointer-events-none animate-in fade-in zoom-in-95 duration-100"
            style={{
              left: `${((points[hoveredIdx].x - paddingLeft) / chartWidth) * 80 + 10}%`,
              top: `${(points[hoveredIdx].y / height) * 60}%`,
              transform: "translate(-50%, -100%)"
            }}
          >
            <div className="text-text-secondary font-semibold text-[9px] mb-0.5">
              Soat {points[hoveredIdx].data.time}
            </div>
            <div className="text-accent-glow">
              {points[hoveredIdx].data.revenue.toLocaleString()} UZS
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
