"use client";

import { Trash2 } from "lucide-react";

interface DeleteRoomButtonProps {
  id: string;
  deleteAction: (formData: FormData) => void;
}

export default function DeleteRoomButton({ id, deleteAction }: DeleteRoomButtonProps) {
  return (
    <form action={deleteAction} onSubmit={(e) => { if (!confirm("Delete this room? This cannot be undone.")) e.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-bold text-error hover:bg-error-bg rounded-full transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete
      </button>
    </form>
  );
}
