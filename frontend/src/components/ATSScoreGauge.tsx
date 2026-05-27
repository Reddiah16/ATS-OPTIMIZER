"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface ATSScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animate?: boolean;
}

interface ScoreStyle {
  gradientId: string;
  colors: [string, string];
  text: string;
  glow: string;
  label: string;
  description: string;
}

function getScoreStyle(score: number): ScoreStyle {
  if (score >= 80) {
    return {
      gradientId: "gaugeExcellent",
      colors: ["#10b981", "#34d399"], // Emerald to Mint
      text: "text-emerald-400",
      glow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]",
      label: "Excellent Fit",
      description: "Highly compatible with job criteria",
    };
  }
  if (score >= 60) {
    return {
      gradientId: "gaugeGood",
      colors: ["#6172f5", "#a78bfa"], // Brand Blue to Lavender
      text: "text-brand-400",
      glow: "shadow-[0_0_30px_rgba(97,114,245,0.3)]",
      label: "Strong Match",
      description: "Ready for submission with minor tweaks",
    };
  }
  if (score >= 40) {
    return {
      gradientId: "gaugeFair",
      colors: ["#f59e0b", "#fbbf24"], // Amber to Yellow
      text: "text-amber-400",
      glow: "shadow-[0_0_30px_rgba(245,158,11,0.3)]",
      label: "Fair Match",
      description: "Needs optimization to stand out",
    };
  }
  return {
    gradientId: "gaugePoor",
    colors: ["#ef4444", "#f87171"], // Red to Rose
    text: "text-red-400",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.3)]",
    label: "Needs Optimization",
    description: "Crucial keywords and skills are missing",
  };
}

const sizes = {
  sm: { radius: 35, stroke: 4, viewBox: 90, fontSize: "text-xl", labelSize: "text-[10px]" },
  md: { radius: 55, stroke: 6, viewBox: 130, fontSize: "text-3xl", labelSize: "text-xs" },
  lg: { radius: 75, stroke: 8, viewBox: 170, fontSize: "text-4xl", labelSize: "text-sm" },
};

export default function ATSScoreGauge({
  score,
  size = "md",
  showLabel = true,
  animate: shouldAnimate = true,
}: ATSScoreGaugeProps) {
  const config = sizes[size];
  const style = getScoreStyle(score);
  const circumference = 2 * Math.PI * config.radius;
  const center = config.viewBox / 2;

  // Motion states for count-up
  const countValue = useMotionValue(0);
  const [roundedCount, setRoundedCount] = useState(0);

  // SVG dash-offset animation
  const strokeDashoffset = useMotionValue(circumference);

  useEffect(() => {
    if (!shouldAnimate) {
      countValue.set(score);
      setRoundedCount(score);
      strokeDashoffset.set(circumference - (score / 100) * circumference);
      return;
    }

    // Count animation
    const controls = animate(countValue, score, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
      onUpdate: (latest) => {
        setRoundedCount(Math.round(latest));
      },
    });

    // Dash offset animation
    const targetOffset = circumference - (score / 100) * circumference;
    const offsetControls = animate(strokeDashoffset, targetOffset, {
      duration: 1.8,
      ease: [0.34, 1.56, 0.64, 1], // spring-like backOut
    });

    return () => {
      controls.stop();
      offsetControls.stop();
    };
  }, [score, shouldAnimate, circumference]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop blob */}
        <div 
          className={clsx(
            "absolute inset-4 rounded-full blur-[25px] opacity-20 pointer-events-none transition-all duration-700",
            style.glow
          )} 
        />

        {/* Core Gauge SVG */}
        <svg
          width={config.viewBox}
          height={config.viewBox}
          viewBox={`0 0 ${config.viewBox} ${config.viewBox}`}
          className="-rotate-90 relative z-10"
        >
          <defs>
            <linearGradient id={style.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={style.colors[0]} />
              <stop offset="100%" stopColor={style.colors[1]} />
            </linearGradient>
            
            {/* Dark inner glow filter */}
            <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="0" dy="2" />
              <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Futuristic dotted background ring */}
          <circle
            cx={center}
            cy={center}
            r={config.radius + 6}
            fill="none"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />

          {/* Track Circle */}
          <circle
            cx={center}
            cy={center}
            r={config.radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={config.stroke}
          />

          {/* Glowing Animated Score Circle */}
          <motion.circle
            cx={center}
            cy={center}
            r={config.radius}
            fill="none"
            stroke={`url(#${style.gradientId})`}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            filter="url(#gaugeShadow)"
          />

          {/* Glow overlay path */}
          <motion.circle
            cx={center}
            cy={center}
            r={config.radius}
            fill="none"
            stroke={`url(#${style.gradientId})`}
            strokeWidth={config.stroke + 3}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            opacity={0.25}
          />
        </svg>

        {/* 3D Glassmorphic Center Orb with score */}
        <div 
          className="absolute inset-[15%] rounded-full z-20 flex flex-col items-center justify-center border border-white/10"
          style={{
            background: "radial-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
            backdropFilter: "blur(8px)",
            boxShadow: "inset 0 4px 12px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Subtle reflection curve */}
          <div className="absolute top-1 left-2 right-2 h-[40%] bg-gradient-to-b from-white/10 to-transparent rounded-full filter blur-[1px] opacity-70 pointer-events-none" />
          
          <motion.span 
            className={clsx("font-display font-extrabold tracking-tight", config.fontSize, style.text)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            {roundedCount}
          </motion.span>
          <span className="text-[10px] text-slate-500 font-mono tracking-wider font-semibold uppercase -mt-0.5">SCORE</span>
        </div>
      </div>

      {showLabel && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className={clsx("font-display font-bold text-sm tracking-wide mb-0.5", style.text)}>{style.label}</p>
          <p className="text-[11px] text-slate-400 max-w-[200px] leading-snug">{style.description}</p>
        </motion.div>
      )}
    </div>
  );
}

// ==============================
// Sleek Animated progress score bar
// ==============================
interface ScoreBarProps {
  label: string;
  score: number;
  maxScore: number;
  color?: string;
}

export function ScoreBar({ label, score, maxScore, color = "#6172f5" }: ScoreBarProps) {
  const pct = Math.round((score / maxScore) * 100);

  return (
    <div className="relative group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors duration-200">{label}</span>
        <span className="text-xs font-mono font-medium text-white flex items-center gap-0.5">
          <span className="font-semibold text-slate-200">{score.toFixed(1)}</span>
          <span className="text-slate-500">/{maxScore}</span>
        </span>
      </div>
      <div className="h-2 bg-white/5 border border-white/5 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="h-full rounded-full relative"
          style={{ backgroundColor: color }}
        >
          {/* Shimmer pulse effect on fill */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        </motion.div>
      </div>
    </div>
  );
}
