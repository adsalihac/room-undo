"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import {
  X, MapPin, Phone, MessageCircle, Star, Share2,
  ChevronLeft, ChevronRight, Eye, EyeOff, ThumbsUp, Flag,
  CheckCircle, ArrowUpDown, Copy, Maximize2, Calculator,
  Clock, ShieldAlert, ExternalLink
} from "lucide-react";
import clsx from "clsx";
import RoomCard from "./RoomCard";
import Toast from "./Toast";
import ReportModal from "./ReportModal";
import InquiryForm from "./InquiryForm";
import type { Room } from "./MapComponent";

interface RoomDetailDrawerProps {
  room: Room | null;
  onClose: () => void;
  allRooms?: Room[];
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return phone;
  const last4 = digits.slice(-4);
  const masked = "*".repeat(digits.length - 4);
  const parts = [];
  for (let i = 0; i < masked.length; i += 4) parts.push(masked.slice(i, i + 4));
  parts.push(last4);
  return parts.join(" ");
}

function getAgeBadge(dateStr: string): { label: string; color: string; bg: string } | null {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return { label: "Today", color: "#00A699", bg: "#E8F5E9" };
  if (days < 2) return { label: "Yesterday", color: "#00A699", bg: "#E8F5E9" };
  if (days < 7) return { label: `${days}d ago`, color: "#FF9600", bg: "#FFF4E0" };
  if (days < 30) return { label: `${Math.floor(days / 7)}w ago`, color: "#717171", bg: "#F7F7F7" };
  return null;
}

export default function RoomDetailDrawer({ room, onClose, allRooms = [] }: RoomDetailDrawerProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reviewSort, setReviewSort] = useState<"newest" | "highest" | "helpful">("newest");
  const [toastMsg, setToastMsg] = useState("");
  const [toastKey, setToastKey] = useState(0);
  const [advance, setAdvance] = useState(5000);
  const [brokerage, setBrokerage] = useState(3000);
  const scrollRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastKey((k) => k + 1);
  }, []);

  const breakdown = useMemo(() => {
    if (!room) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    room.reviews.forEach((r) => { counts[r.rating] = (counts[r.rating] || 0) + 1; });
    return counts;
  }, [room?.reviews]);

  const sortedReviews = useMemo(() => {
    if (!room) return [];
    const sorted = [...room.reviews];
    switch (reviewSort) {
      case "newest":
        sorted.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        break;
      case "highest":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "helpful":
        sorted.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
        break;
    }
    return sorted;
  }, [room?.reviews, reviewSort]);

  const similarRooms = useMemo(() => {
    if (!room || allRooms.length === 0) return [];
    return allRooms
      .filter((r) => r.id !== room.id && (r.location_name === room.location_name || Math.abs(r.price - room.price) / room.price < 0.3))
      .slice(0, 3);
  }, [room, allRooms]);

  if (!room) return null;

  const images = room.images.length > 0 ? room.images : room.image_url ? [room.image_url] : [];
  const hasMultiple = images.length > 1;

  const prevImage = () => setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const shareText = `🏠 *${room.title}*\n📍 ${room.location_name}\n💰 ₹${room.price.toLocaleString("en-IN")}/mo\n📋 ${room.property_type}\n\nCheck it out on RoomUndo!`;

  const avgRating = room.reviews.length > 0
    ? room.reviews.reduce((s, r) => s + r.rating, 0) / room.reviews.length
    : 0;

  const totalMoveIn = room.deposit + advance + brokerage;
  const ageBadge = getAgeBadge(room.created_at);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?room=${room.id}`;
    navigator.clipboard.writeText(url).then(() => showToast("Link copied to clipboard!")).catch(() => showToast("Failed to copy link"));
  };

  return (
    <>
      {/* Backdrop */}
      <div className={clsx("fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm transition-all duration-300", room ? "opacity-100" : "opacity-0 pointer-events-none")} onClick={onClose} />

      {/* Main modal */}
      <div className={clsx("fixed inset-0 z-[2001] flex items-center justify-center p-4 transition-all duration-300", room ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none")}>
        <div className="w-full max-w-[540px] max-h-[88vh] bg-surface rounded-3xl shadow-2xl shadow-black/10 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="relative h-2 w-full shrink-0" style={{ backgroundColor: "#FF385C" }} />

          <div className="relative px-7 pt-6 pb-5">
            <div className="absolute top-5 right-5 flex items-center gap-1.5 z-10">
              <button onClick={handleCopyLink} className="w-9 h-9 flex items-center justify-center rounded-full text-secondary-text hover:text-accent hover:bg-accent-light transition-colors" title="Copy link">
                <Copy className="w-4 h-4" />
              </button>
              <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank")} className="w-9 h-9 flex items-center justify-center rounded-full text-secondary-text hover:text-accent hover:bg-accent-light transition-colors" title="Share via WhatsApp">
                <Share2 className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full text-secondary-text hover:text-accent hover:bg-accent-light transition-colors">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <h2 className="text-[22px] font-extrabold text-primary-text leading-tight pr-20">{room.title}</h2>
            <div className="flex items-center gap-1.5 text-secondary-text mt-1.5">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="text-[14px] font-bold">{room.location_name}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-3xl font-extrabold text-primary-text tracking-tight">₹{room.price.toLocaleString("en-IN")}</span>
              <span className="text-[14px] text-secondary-text font-bold">/ month</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-secondary-text mt-1.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[12px] font-extrabold" style={{ backgroundColor: "var(--color-accent-orange-bg)", color: "var(--color-accent-orange)" }}>
                Deposit: ₹{room.deposit.toLocaleString("en-IN")}
              </span>
              <span className="text-border-color">·</span>
              <span className="font-bold" style={{ color: "var(--color-primary-text)" }}>{room.property_type}</span>
              {ageBadge && (
                <>
                  <span className="text-border-color">·</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold" style={{ backgroundColor: ageBadge.bg, color: ageBadge.color }}>
                    {ageBadge.label}
                  </span>
                </>
              )}
              {room.views > 0 && (
                <>
                  <span className="text-border-color">·</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold" style={{ backgroundColor: "var(--color-accent-blue-bg)", color: "var(--color-accent-blue)" }}>
                    {room.views} views
                  </span>
                </>
              )}
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-7 pb-6 space-y-6">
            {/* Image gallery */}
            {images.length > 0 && (
              <section>
                <div className="relative rounded-2xl overflow-hidden border-2 border-border-color/50 bg-background group">
                  <img src={images[imgIndex]} alt={room.title} className="w-full h-52 object-cover cursor-pointer" onClick={() => setShowLightbox(true)} />
                  <button onClick={() => setShowLightbox(true)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60">
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                  </button>
                  {hasMultiple && (
                    <>
                      <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors">
                        <ChevronLeft className="w-4 h-4 text-primary-text" />
                      </button>
                      <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors">
                        <ChevronRight className="w-4 h-4 text-primary-text" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, i) => (
                          <button key={i} onClick={() => setImgIndex(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? "w-4 bg-white" : "bg-white/50"}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </section>
            )}

            {/* Description */}
            {room.description && (
              <section>
                <h3 className="text-[12px] font-extrabold text-secondary-text uppercase tracking-wider mb-2.5">About this room</h3>
                <p className="text-[14px] text-primary-text leading-relaxed font-semibold">{room.description}</p>
              </section>
            )}

            {/* Tags */}
            {room.tags.length > 0 && (
              <section>
                <h3 className="text-[12px] font-extrabold text-secondary-text uppercase tracking-wider mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {room.tags.map((tag) => (
                    <span key={tag} className="px-3.5 py-1.5 text-[13px] font-extrabold rounded-full border-2" style={{ borderColor: "var(--color-border-color)", color: "var(--color-primary-text)", backgroundColor: "var(--color-background)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Amenities */}
            {room.amenities.length > 0 && (
              <section>
                <h3 className="text-[12px] font-extrabold text-secondary-text uppercase tracking-wider mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <span key={amenity} className="px-3.5 py-1.5 text-[13px] font-extrabold rounded-full border-2" style={{ borderColor: "var(--color-border-color)", color: "var(--color-primary-text)", backgroundColor: "var(--color-background)" }}>
                      {amenity}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            {room.reviews.length > 0 && (
              <section>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-[12px] font-extrabold text-secondary-text uppercase tracking-wider mb-2">Reviews</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-extrabold text-primary-text">{avgRating.toFixed(1)}</span>
                      <div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4" style={{ color: star <= Math.round(avgRating) ? "#FF9600" : "#DDD", fill: star <= Math.round(avgRating) ? "#FF9600" : "transparent" }} />
                          ))}
                        </div>
                        <span className="text-[12px] font-bold text-secondary-text">{room.reviews.length} {room.reviews.length === 1 ? "review" : "reviews"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <select value={reviewSort} onChange={(e) => setReviewSort(e.target.value as "newest" | "highest" | "helpful")} className="appearance-none pl-3 pr-7 h-[34px] rounded-full text-[12px] font-extrabold border-2 border-border-color bg-white cursor-pointer outline-none focus:border-accent/40 transition-all" style={{ color: "#222222" }}>
                      <option value="newest">Newest</option>
                      <option value="highest">Highest Rated</option>
                      <option value="helpful">Most Helpful</option>
                    </select>
                    <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary-text pointer-events-none" />
                  </div>
                </div>
                <div className="mb-4 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = breakdown[star];
                    const pct = room.reviews.length > 0 ? (count / room.reviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-[12px] font-bold text-secondary-text w-4 text-right">{star}</span>
                        <Star className="w-3 h-3" style={{ color: "#FF9600", fill: "#FF9600" }} />
                        <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: "#FF9600" }} />
                        </div>
                        <span className="text-[11px] font-bold text-secondary-text w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2.5">
                  {sortedReviews.map((review, index) => (
                    <div key={index} className="p-4 rounded-2xl border-2" style={{ borderColor: "var(--color-border-color)", backgroundColor: "var(--color-background)" }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-extrabold" style={{ color: "var(--color-primary-text)" }}>{review.username}</span>
                          {review.verified && (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold" style={{ backgroundColor: "var(--color-success-bg)", color: "var(--color-success)" }}>
                              <CheckCircle className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {Array.from({ length: review.rating }, (_, i) => (
                              <Star key={i} className="w-3.5 h-3.5" style={{ color: "#FF9600", fill: "#FF9600" }} />
                            ))}
                          </div>
                          <button onClick={() => alert("Review reported. We'll review it shortly.")} className="p-1 rounded-full hover:text-red-500 transition-colors" style={{ color: "var(--color-secondary-text)" }} aria-label="Report review">
                            <Flag className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[13px] leading-relaxed font-semibold" style={{ color: "var(--color-secondary-text)" }}>{review.comment}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t" style={{ borderColor: "var(--color-border-color)" }}>
                        {review.date && (
                          <span className="text-[11px] font-bold" style={{ color: "var(--color-secondary-text)" }}>
                            {new Date(review.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                          </span>
                        )}
                        <button onClick={() => showToast("Marked as helpful!")} className="flex items-center gap-1 text-[11px] font-bold hover:text-accent transition-colors" style={{ color: "var(--color-secondary-text)" }}>
                          <ThumbsUp className="w-3 h-3" /> Helpful ({review.helpful || 0})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Similar Rooms */}
            {similarRooms.length > 0 && (
              <section>
                <h3 className="text-[12px] font-extrabold text-secondary-text uppercase tracking-wider mb-3">Similar Rooms</h3>
                <div className="space-y-2.5">
                  {similarRooms.map((sr) => (
                    <RoomCard
                      key={sr.id}
                      room={sr}
                      isSelected={false}
                      onClick={() => {
                        onClose();
                        window.location.href = `/?room=${sr.id}`;
                      }}
                      savedRooms={[]}
                      toggleSaved={() => {}}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Report button */}
          <div className="px-7 py-2 border-t border-border-color/30 flex justify-center">
            <button onClick={() => setShowReport(true)} className="flex items-center gap-1.5 text-[12px] font-bold text-secondary-text hover:text-red-500 transition-colors">
              <ShieldAlert className="w-3.5 h-3.5" /> Report this listing
            </button>
          </div>

          {/* Action buttons */}
          <div className="border-t p-4 flex flex-col gap-2.5" style={{ borderColor: "var(--color-border-color)", backgroundColor: "var(--color-background)" }}>
            {/* Inquiry form */}
            {!showPhone && !showInquiry && (
              <button onClick={() => setShowInquiry(true)} className="w-full h-[42px] rounded-full text-[14px] font-extrabold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0" style={{ backgroundColor: "#FF385C" }}>
                Reveal Contact — Send Inquiry
              </button>
            )}
            {showInquiry && !showPhone && (
              <InquiryForm onSubmit={(name, msg) => {
                setShowPhone(true);
                showToast(`Thanks ${name}! Phone number revealed.`);
              }} />
            )}
            {/* Phone */}
            {showPhone && (
              <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl border-2" style={{ borderColor: "var(--color-border-color)", backgroundColor: "var(--color-surface)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--color-accent-light)" }}>
                    <Phone className="w-4 h-4" style={{ color: "#FF385C" }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-extrabold" style={{ color: "var(--color-primary-text)" }}>{room.phone}</p>
                    <p className="text-[11px] font-bold" style={{ color: "var(--color-secondary-text)" }}>Phone</p>
                  </div>
                </div>
                <button onClick={() => setShowPhone(false)} className="flex items-center gap-1.5 px-3 h-[32px] rounded-full text-[12px] font-extrabold transition-all" style={{ backgroundColor: "var(--color-accent-light)", color: "#FF385C", border: "1.5px solid var(--color-border-color)" }}>
                  <EyeOff className="w-3.5 h-3.5" /> Hide
                </button>
              </div>
            )}
            {showPhone && (
              <div className="flex gap-2.5">
                <a href={`tel:${room.phone}`} className="flex-1 flex items-center justify-center gap-2 h-[48px] rounded-full text-[15px] font-extrabold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0" style={{ backgroundColor: "#FF385C" }}>
                  <Phone className="w-4.5 h-4.5" /> Call Owner
                </a>
                <a href={`https://wa.me/${room.whatsapp.replace(/\+/g, "").replace(/\s/g, "")}?text=${encodeURIComponent("Hi, I'm interested in " + room.title)}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 h-[48px] rounded-full text-[15px] font-extrabold border-2 transition-all hover:-translate-y-0.5 active:translate-y-0" style={{ borderColor: "var(--color-border-color)", color: "var(--color-primary-text)", backgroundColor: "var(--color-surface)" }}>
                  <MessageCircle className="w-4.5 h-4.5" /> WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-[5000] bg-black/90 flex items-center justify-center" onClick={() => setShowLightbox(false)}>
          <button onClick={() => setShowLightbox(false)} className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
          {hasMultiple && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10">
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10">
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}
          <img src={images[imgIndex]} alt={room.title} className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Report Modal */}
      {showReport && <ReportModal roomTitle={room.title} onClose={() => setShowReport(false)} />}

      {/* Toast */}
      <Toast key={toastKey} message={toastMsg} visible={toastMsg !== ""} onClose={() => setToastMsg("")} />
    </>
  );
}
