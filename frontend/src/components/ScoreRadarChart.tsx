"use client";

import { ScoreBreakdown } from "@/types";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

interface ScoreRadarChartProps {
  scoreBreakdown: ScoreBreakdown;
}

export default function ScoreRadarChart({ scoreBreakdown }: ScoreRadarChartProps) {
  const data = [
    {
      subject: "Keywords",
      percentage: Math.round((scoreBreakdown.keyword_score / 35) * 100),
      score: scoreBreakdown.keyword_score,
      max: 35,
      color: "#6172f5",
    },
    {
      subject: "Skills",
      percentage: Math.round((scoreBreakdown.skill_score / 30) * 100),
      score: scoreBreakdown.skill_score,
      max: 30,
      color: "#a78bfa",
    },
    {
      subject: "Experience",
      percentage: Math.round((scoreBreakdown.experience_score / 20) * 100),
      score: scoreBreakdown.experience_score,
      max: 20,
      color: "#34d399",
    },
    {
      subject: "Formatting",
      percentage: Math.round((scoreBreakdown.formatting_score / 15) * 100),
      score: scoreBreakdown.formatting_score,
      max: 15,
      color: "#fbbf24",
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="glass px-3.5 py-2.5 rounded-xl border border-white/10 shadow-xl backdrop-blur-md">
          <p className="text-xs font-semibold text-white mb-1.5">{item.subject}</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-4 text-[11px]">
              <span className="text-slate-400">Section Score:</span>
              <span className="font-mono font-medium text-white">
                {item.score.toFixed(1)} / {item.max}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4 text-[11px]">
              <span className="text-slate-400">Match Rate:</span>
              <span
                className="font-mono font-semibold"
                style={{ color: item.color }}
              >
                {item.percentage}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-[260px] flex items-center justify-center"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <defs>
            <linearGradient id="radarGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6172f5" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.15} />
            </linearGradient>
          </defs>
          
          <PolarGrid
            stroke="rgba(255, 255, 255, 0.08)"
            gridType="polygon"
          />
          
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: "rgba(226, 232, 240, 0.8)",
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "var(--font-body)",
            }}
          />
          
          <PolarRadiusAxis
            angle={45}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          
          <Radar
            name="ATS Breakdown"
            dataKey="percentage"
            stroke="url(#radarGlow)"
            strokeWidth={1.5}
            fill="url(#radarGlow)"
            fillOpacity={0.65}
            dot={{
              r: 3,
              fill: "#6172f5",
              stroke: "#fff",
              strokeWidth: 1,
            }}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={false} />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Decorative center glow behind the chart */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[120px] h-[120px] bg-brand-500/10 rounded-full blur-[40px]" />
      </div>
    </motion.div>
  );
}
