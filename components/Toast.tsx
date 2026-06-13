"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";
import clsx from "clsx";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, visible, onClose, duration = 2500 }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  return (
    <div
      className={clsx(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-2xl border border-border-color/50 transition-all duration-300",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
      style={{ backgroundColor: "var(--color-surface-raised, #222)", color: "#FFFFFF" }}
    >
      <CheckCircle className="w-4.5 h-4.5 shrink-0" style={{ color: "#00A699" }} />
      <span className="text-[14px] font-extrabold">{message}</span>
      <button onClick={() => { setShow(false); setTimeout(onClose, 300); }} className="ml-1 p-0.5 rounded-full opacity-60 hover:opacity-100 transition-opacity">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
