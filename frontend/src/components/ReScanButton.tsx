import React, { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { analysisApi } from "@/lib/api";

interface ReScanButtonProps {
  analysisId: number;
  currentText: string;
  onRescoreComplete: (data: any) => void;
}

export default function ReScanButton({ analysisId, currentText, onRescoreComplete }: ReScanButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleRescore = async () => {
    try {
      setLoading(true);
      const data = await analysisApi.rescoreAnalysis(analysisId, { resume_text: currentText });
      onRescoreComplete(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRescore}
      disabled={loading}
      className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
      {loading ? "Re-scoring..." : "Update Score"}
    </button>
  );
}
