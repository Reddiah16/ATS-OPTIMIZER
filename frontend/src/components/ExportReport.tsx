"use client";

import { useState } from "react";

import { Download, Loader2 } from "lucide-react";

interface Props {
  analysisId: string;
}

export default function ExportReport({
  analysisId,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const exportPDF = async () => {

    try {

      setLoading(true);

      // =========================
      // DYNAMIC IMPORTS
      // =========================

      const [
        { default: jsPDF },
        html2canvas,
      ] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const input =
        document.getElementById(
          "analysis-report"
        );

      if (!input) return;

      // =========================
      // CREATE CANVAS
      // =========================

      const canvas =
        await html2canvas.default(
          input,
          {
            scale: 2,
            useCORS: true,
          }
        );

      const imgData =
        canvas.toDataURL("image/png");

      // =========================
      // CREATE PDF
      // =========================

      const pdf = new jsPDF(
        "p",
        "mm",
        "a4"
      );

      const pdfWidth =
        pdf.internal.pageSize.getWidth();

      const pdfHeight =
        (canvas.height * pdfWidth) /
        canvas.width;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      // =========================
      // SAVE PDF
      // =========================

      pdf.save(
        `ResumeIQ_Report_${analysisId}.pdf`
      );

    } catch (error) {

      console.error(
        "PDF Export Error:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <button
      onClick={exportPDF}
      disabled={loading}

      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-500 transition-all disabled:opacity-60"
    >

      {loading ? (
        <>
          <Loader2
            size={16}
            className="animate-spin"
          />

          Exporting...
        </>
      ) : (
        <>
          <Download size={16} />

          Download Report
        </>
      )}
    </button>
  );
}