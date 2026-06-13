"use client";

import { useState } from "react";
import { MessageSquareReply, X } from "lucide-react";

interface ReplyToReviewProps {
  reviewId: string;
  currentReply: string;
}

export default function ReplyToReview({ reviewId, currentReply }: ReplyToReviewProps) {
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState(currentReply);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/reviews/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, reply }),
      });
      if (!res.ok) throw new Error();
      setOpen(false);
    } catch {
      alert("Failed to save reply.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {!open ? (
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-2 text-[12px] font-extrabold rounded-full border-2 transition-all hover:-translate-y-0.5" style={{ borderColor: "#E5E5E5", color: currentReply ? "#00A699" : "#717171" }}>
          <MessageSquareReply className="w-3.5 h-3.5" />
          {currentReply ? "Edit Reply" : "Reply"}
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write an owner reply..." className="w-40 px-3 py-2 rounded-full text-[12px] font-bold border-2 outline-none" style={{ borderColor: "#FF385C" }} />
          <button onClick={handleSave} disabled={saving || !reply.trim()} className="px-3 py-2 rounded-full text-[12px] font-extrabold text-white disabled:opacity-40" style={{ backgroundColor: "#FF385C" }}>
            {saving ? "..." : "Save"}
          </button>
          <button onClick={() => { setOpen(false); setReply(currentReply); }} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
