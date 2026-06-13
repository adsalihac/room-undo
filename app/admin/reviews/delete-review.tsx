"use client";

import { Trash2 } from "lucide-react";

interface DeleteReviewButtonProps {
  id: string;
  deleteAction: (formData: FormData) => void;
}

export default function DeleteReviewButton({ id, deleteAction }: DeleteReviewButtonProps) {
  return (
    <form action={deleteAction} onSubmit={(e) => { if (!confirm("Delete this review?")) e.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-extrabold rounded-full border-2 transition-all hover:-translate-y-0.5" style={{ borderColor: "#FFE6E6", color: "#FF4B4B", backgroundColor: "#FFE6E6" }}>
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </form>
  );
}
