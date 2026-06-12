"use client";

import { X, MapPin, Phone, MessageCircle, Star, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import type { Room } from "./MapComponent";

interface RoomDetailDrawerProps {
  room: Room | null;
  onClose: () => void;
}

export default function RoomDetailDrawer({ room, onClose }: RoomDetailDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 z-[2000] bg-black/40 transition-opacity duration-250 ease-out",
          room ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={clsx(
          "fixed inset-0 z-[2001] flex items-center justify-center p-4 transition-all duration-250 ease-out",
          room ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {room && (
          <div className="w-full max-w-[520px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="relative px-8 pt-7 pb-5 border-b border-border-color">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-xl text-secondary-text hover:text-primary-text hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-[20px] font-semibold text-primary-text leading-snug pr-8">
                {room.title}
              </h2>
              <div className="flex items-center gap-1.5 text-secondary-text mt-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="text-[14px]">{room.location_name}</span>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-2xl font-bold text-primary-text tracking-tight">₹{room.price.toLocaleString("en-IN")}</span>
                <span className="text-[14px] text-secondary-text">/ month</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-secondary-text mt-0.5">
                <span>Deposit: ₹{room.deposit.toLocaleString("en-IN")}</span>
                <span className="text-border-color">·</span>
                <span>{room.property_type}</span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-7">
              {/* Description */}
              <section>
                <h3 className="text-[11px] font-semibold text-secondary-text uppercase tracking-[0.12em] mb-2.5">About this room</h3>
                <p className="text-[14px] text-primary-text leading-relaxed">
                  {room.description}
                </p>
              </section>

              {/* Amenities */}
              {room.amenities.length > 0 && (
                <section>
                  <h3 className="text-[11px] font-semibold text-secondary-text uppercase tracking-[0.12em] mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map(amenity => (
                      <div key={amenity} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-xl border border-border-color text-[13px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary-text" />
                        <span className="text-primary-text">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Reviews */}
              {room.reviews.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[11px] font-semibold text-secondary-text uppercase tracking-[0.12em]">Reviews</h3>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-primary-text fill-current" />
                      <span className="text-[13px] font-semibold text-primary-text">
                        {(room.reviews.reduce((sum, r) => sum + r.rating, 0) / room.reviews.length).toFixed(1)}
                      </span>
                      <span className="text-[12px] text-secondary-text">({room.reviews.length})</span>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {room.reviews.map((review, index) => (
                      <div key={index} className="p-3.5 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[13px] font-medium text-primary-text">{review.username}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: review.rating }, (_, i) => (
                              <Star key={i} className="w-3 h-3 text-primary-text fill-current" />
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

            {/* Footer */}
            <div className="border-t border-border-color p-4 flex gap-3">
              <a
                href={`tel:${room.phone}`}
                className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-xl text-[14px] font-medium text-white transition-colors"
                style={{ backgroundColor: '#0F172A' }}
              >
                <Phone className="w-4 h-4" />
                Call Owner
              </a>
              <a
                href={`https://wa.me/${room.whatsapp.replace(/\+/g, "").replace(/\s/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 h-[44px] bg-white border border-border-color text-primary-text rounded-xl text-[14px] font-medium hover:bg-gray-50 transition-colors"
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
