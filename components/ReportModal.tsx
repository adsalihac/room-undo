"use client";

import { useState } from "react";
import { X, Flag, CheckCircle } from "lucide-react";
import clsx from "clsx";

interface ReportModalProps {
  roomTitle: string;
  onClose: () => void;
}

const reasons = [
  "Spam or fake listing",
  "Wrong location",
  "Incorrect pricing",
  "Room already taken",
  "Inappropriate content",
  "Other",
];

export default function ReportModal({ roomTitle, onClose }: ReportModalProps) {
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    setTimeout(onClose, 1500);
  };

  return (
    <>
      <div className="fixed inset-0 z-[4000] bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[4001] flex items-center justify-center p-4">
        <div
          className="w-full max-w-[400px] bg-surface rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 pt-6 pb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FFF2F4" }}>
                <Flag className="w-4.5 h-4.5" style={{ color: "#FF385C" }} />
              </div>
              <div>
                <h2 className="text-[16px] font-extrabold text-primary-text">Report Listing</h2>
                <p className="text-[12px] font-bold text-secondary-text mt-0.5 truncate max-w-[280px]">{roomTitle}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-secondary-text hover:text-accent transition-colors">
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {submitted ? (
            <div className="px-6 pb-8 text-center">
              <div className="w-14 h-14 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6" style={{ color: "#00A699" }} />
              </div>
              <p className="text-[15px] font-extrabold text-primary-text">Report submitted</p>
              <p className="text-[13px] text-secondary-text font-semibold mt-1">We&apos;ll review it shortly.</p>
            </div>
          ) : (
            <div className="px-6 pb-6">
              <p className="text-[13px] font-bold text-secondary-text mb-3">Why are you reporting this listing?</p>
              <div className="space-y-2">
                {reasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setSelected(reason)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-[14px] font-bold transition-all ${
                      selected === reason
                        ? "border-accent bg-accent-light text-accent"
                        : "border-border-color bg-background text-primary-text hover:border-gray-300"
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!selected}
                className={`w-full mt-4 h-[44px] rounded-full text-[14px] font-extrabold text-white transition-all ${
                  selected ? "opacity-100 hover:shadow-lg hover:-translate-y-0.5" : "opacity-40 cursor-not-allowed"
                }`}
                style={{ backgroundColor: "#FF385C" }}
              >
                Submit Report
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
