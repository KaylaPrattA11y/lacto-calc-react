import React, { useMemo } from "react";
import type { FermentEntry } from "../../types";
import { formatter, getFormattedVal } from "../../utils/formatter";

interface CalculatorJarProps {
  weight?: FermentEntry["weight"] | null;
  saltRequired?: FermentEntry["saltRequired"] | null;
  brinePercentage?: FermentEntry["brinePercentage"] | null;
  unit?: FermentEntry["unit"] | null;
}

export default function CalculatorJar({ weight, saltRequired, brinePercentage, unit }: CalculatorJarProps) {
  const { saltWeightFormatted, brinePercentageFormatted, weightFormatted } = useMemo(() => {
    return {
      saltWeightFormatted: getFormattedVal(saltRequired || 0, unit || 'g'),
      brinePercentageFormatted: formatter.percent.format(brinePercentage ? brinePercentage / 100 : 0),
      weightFormatted: getFormattedVal(weight || 0, unit || 'g')
    };
  }, [saltRequired, brinePercentage, weight, unit]);

  const { fillH, fillY } = useMemo(() => {
    if (brinePercentage == null || weight == null) {
      return { fillH: 0, fillY: 275 };
    }
    const fillRatio = Math.min(brinePercentage ? brinePercentage / 12 : 0, 1);
    const jarH = 239; // approximate jar interior height
    const fillH = Math.round(fillRatio * jarH);
    const fillY = 275 - fillH;
    return { fillH, fillY };
  }, [brinePercentage, weight]);

  const { tsp, tbsp } = useMemo(() => {
    if (saltRequired && saltRequired > 0) {
      if (unit === 'grams') {
        const tsp = (saltRequired / 6).toFixed(1);
        const tbsp = (saltRequired / 18).toFixed(1);
        return { tsp, tbsp };
      }
      if (unit === 'ounces') {
        const tsp = (saltRequired / 0.21).toFixed(1);
        const tbsp = (saltRequired / 0.63).toFixed(1);
        return { tsp, tbsp };
      }
      return { tsp: null, tbsp: null };
    }
    return { tsp: null, tbsp: null };
  }, [saltRequired, unit]);

  return (
    <div className="jar-area" aria-live="polite" aria-atomic="true">
      <svg className="jar-svg" viewBox="0 0 260 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Lid band */}
        <rect x="62" y="22" width="136" height="14" rx="4" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2"></rect>
        {/* Lid top */}
        <rect x="54" y="10" width="152" height="16" rx="5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"></rect>
        {/* Jar body */}
        <path d="M72 36 L62 60 L50 80 L46 120 L44 200 L46 240 L54 262 L80 272 L130 275 L180 272 L206 262 L214 240 L216 200 L214 120 L210 80 L198 60 L188 36 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinejoin="round"></path>
        {/* Brine fill (animated) */}
        <clipPath id="jar-clip">
          <path d="M72 36 L62 60 L50 80 L46 120 L44 200 L46 240 L54 262 L80 272 L130 275 L180 272 L206 262 L214 240 L216 200 L214 120 L210 80 L198 60 L188 36 Z"></path>
        </clipPath>
        <rect id="brine-fill" x="44" y={fillY} width="172" height={fillH} fill="rgba(30,100,130,0.35)" clipPath="url(#jar-clip)" style={{transition: 'y 0.6s ease, height 0.6s ease'}}></rect>
        {/* Shine */}
        <ellipse cx="90" cy="140" rx="10" ry="30" fill="rgba(255,255,255,0.05)" transform="rotate(-15 90 140)"></ellipse>
        {/* Threads on neck */}
        <path d="M66 44 Q130 40 194 44" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none"></path>
        <path d="M64 50 Q130 46 196 50" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none"></path>
      </svg>
      {saltRequired != null && saltRequired > 0 ? (
      <div className="jar-result-text" id="jar-text">
        <div className="result-sub">
          <span>{brinePercentageFormatted} of {weightFormatted}</span>
        </div>
        <div className="result-big">
          <span>{saltWeightFormatted}<small> salt</small></span>
        </div>
        {tsp && tbsp && (
        <div className="result-sub">
          <span>≈ {tsp} tsp &nbsp;·&nbsp; {tbsp} Tbsp</span>
        </div>
        )}
      </div>
      ) : (
      <div className="jar-result-text">
        <p>Please enter <strong>Salt brine</strong> percentage and <strong>Weight</strong> to calculate salt required.</p>
      </div>
      )}
    </div>
  )
}