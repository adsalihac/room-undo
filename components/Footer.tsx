import Logo from "./Logo";

export default function Footer() {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t border-border-color bg-surface">
      <Logo size={18} />
      <p className="text-[11px] text-secondary-text font-medium">
        &copy; 2026 RoomUndo
      </p>
    </div>
  );
}
