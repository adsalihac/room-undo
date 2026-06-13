"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SplitPanelProps {
  first: React.ReactNode;
  second: React.ReactNode;
  orientation?: "vertical" | "horizontal";
  defaultRatio?: number;
  minRatio?: number;
  maxRatio?: number;
}

export default function SplitPanel({
  first,
  second,
  orientation = "vertical",
  defaultRatio = 0.65,
  minRatio = 0.3,
  maxRatio = 0.85,
}: SplitPanelProps) {
  const [ratio, setRatio] = useState(defaultRatio);
  const draggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = true;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pos = orientation === "vertical" ? e.clientY - rect.top : e.clientX - rect.left;
      const total = orientation === "vertical" ? rect.height : rect.width;
      const newRatio = Math.max(minRatio, Math.min(maxRatio, pos / total));
      setRatio(newRatio);
    };

    const handleMouseUp = () => {
      draggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [minRatio, maxRatio, orientation]);

  const isHorizontal = orientation === "horizontal";

  return (
    <div ref={containerRef} className={`w-full h-full flex ${isHorizontal ? "flex-row" : "flex-col"}`}>
      <div
        style={isHorizontal ? { width: `${ratio * 100}%` } : { height: `${ratio * 100}%` }}
        className="overflow-hidden"
      >
        {first}
      </div>
      <div
        className={`relative flex items-center justify-center shrink-0 transition-colors group ${
          isHorizontal
            ? "w-[6px] cursor-col-resize flex-col"
            : "h-[6px] cursor-row-resize"
        } bg-border-color/30 hover:bg-border-color/60`}
        onMouseDown={handleMouseDown}
      >
        <div
          className={`rounded-full bg-border-color/50 group-hover:bg-border-color transition-colors ${
            isHorizontal ? "h-8 w-1" : "w-8 h-1"
          }`}
        />
      </div>
      <div
        style={isHorizontal ? { width: `${(1 - ratio) * 100}%` } : { height: `${(1 - ratio) * 100}%` }}
        className="overflow-hidden"
      >
        {second}
      </div>
    </div>
  );
}
