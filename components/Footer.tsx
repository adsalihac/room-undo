import Logo from "./Logo";

export default function Footer() {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t border-border-color bg-surface/80">
      <Logo size={18} showWordmark={false} />
      <p className="text-[11px] font-medium text-secondary-text">
        &copy; 2026 RoomUndo
      </p>
    </div>
  );
}
