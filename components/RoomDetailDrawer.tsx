"use client";

import { X, MapPin, Phone, MessageCircle, Star } from "lucide-react";
import clsx from "clsx";
import type { Room } from "./MapComponent";

interface RoomDetailDrawerProps {
  room: Room | null;
  onClose: () => void;
}

export default function RoomDetailDrawer({ room, onClose }: RoomDetailDrawerProps) {
  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm transition-all duration-300",
          room ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div
        className={clsx(
          "fixed inset-0 z-[2001] flex items-center justify-center p-4 transition-all duration-300",
          room ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
        )}
      >
        {room && (
          <div className="w-full max-w-[540px] max-h-[88vh] bg-surface rounded-2xl shadow-2xl shadow-black/10 flex flex-col overflow-hidden">
            {/* Header with gradient accent bar */}
            <div className="relative h-1.5 w-full bg-accent shrink-0" />

            <div className="relative px-7 pt-6 pb-5">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg text-secondary-text hover:text-primary-text hover:bg-accent-light transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-xl font-bold text-primary-text leading-snug pr-10">
                {room.title}
              </h2>
              <div className="flex items-center gap-1.5 text-secondary-text mt-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[13px]">{room.location_name}</span>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-3xl font-extrabold text-primary-text tracking-tight">
                  ₹{room.price.toLocaleString("en-IN")}
                </span>
                <span className="text-[14px] text-secondary-text">/ month</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-secondary-text mt-1">
                <span className="px-2 py-0.5 bg-accent-warm-bg text-accent-warm rounded-md text-[11px] font-semibold">
                  Deposit: ₹{room.deposit.toLocaleString("en-IN")}
                </span>
                <span className="text-border-color">·</span>
                <span>{room.property_type}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-7 pb-6 space-y-6">
              {room.description && (
                <section>
                  <h3 className="text-[11px] font-bold text-secondary-text uppercase tracking-[0.08em] mb-2.5">
                    About this room
                  </h3>
                  <p className="text-[14px] text-primary-text leading-relaxed">{room.description}</p>
                </section>
              )}

              {room.amenities.length > 0 && (
                <section>
                  <h3 className="text-[11px] font-bold text-secondary-text uppercase tracking-[0.08em] mb-3">
                    Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map(amenity => (
                      <span
                        key={amenity}
                        className="px-3 py-1.5 text-[12px] font-semibold text-primary-text bg-accent-light rounded-lg border border-border-color/50"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {room.reviews.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[11px] font-bold text-secondary-text uppercase tracking-[0.08em]">
                      Reviews
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-accent-warm fill-accent-warm" />
                      <span className="text-[13px] font-bold text-primary-text">
                        {(room.reviews.reduce((sum, r) => sum + r.rating, 0) / room.reviews.length).toFixed(1)}
                      </span>
                      <span className="text-[12px] text-secondary-text">({room.reviews.length})</span>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {room.reviews.map((review, index) => (
                      <div key={index} className="p-4 bg-accent-light rounded-xl border border-border-color/30">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[13px] font-semibold text-primary-text">{review.username}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: review.rating }, (_, i) => (
                              <Star key={i} className="w-3 h-3 text-accent-warm fill-accent-warm" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[13px] text-secondary-text leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Action buttons */}
            <div className="border-t border-border-color p-4 flex gap-2.5 bg-accent-light/30">
              <a
                href={`tel:${room.phone}`}
                className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-full text-[14px] font-bold text-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ backgroundColor: '#0F172A' }}
              >
                <Phone className="w-4 h-4" />
                Call Owner
              </a>
              <a
                href={`https://wa.me/${room.whatsapp.replace(/\+/g, "").replace(/\s/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-full text-[14px] font-bold text-primary-text border-2 border-border-color hover:bg-surface hover:border-accent/20 transition-all hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
