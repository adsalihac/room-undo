import Logo from "./Logo";

export default function Footer() {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-border-color bg-surface">
      <Logo size={20} showWordmark={false} />
      <p className="text-[12px] font-bold text-secondary-text">
        &copy; 2026 RoomUndo
      </p>
    </div>
  );
}
