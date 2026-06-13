"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

interface InquiryFormProps {
  onSubmit: (name: string, message: string) => void;
}

export default function InquiryForm({ onSubmit }: InquiryFormProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim(), message.trim());
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl" style={{ backgroundColor: "var(--color-success-bg)" }}>
        <CheckCircle className="w-4.5 h-4.5 shrink-0" style={{ color: "var(--color-success)" }} />
        <p className="text-[13px] font-extrabold" style={{ color: "var(--color-success)" }}>Inquiry sent! Owner contact revealed below.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        required
        className="w-full px-4 h-[42px] rounded-xl border-2 border-border-color bg-white text-[14px] font-semibold text-primary-text placeholder:text-gray-400 outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Hi, I'm interested in this room. Is it still available?"
        rows={2}
        className="w-full px-4 py-2.5 rounded-xl border-2 border-border-color bg-white text-[14px] font-semibold text-primary-text placeholder:text-gray-400 outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all resize-none"
      />
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 h-[42px] rounded-full text-[14px] font-extrabold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        style={{ backgroundColor: "#FF385C" }}
      >
        <Send className="w-4 h-4" />
        Send Inquiry
      </button>
    </form>
  );
}
