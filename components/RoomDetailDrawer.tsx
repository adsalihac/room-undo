"use client";

import { X, MapPin, Phone, MessageCircle } from "lucide-react";
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
          "fixed inset-0 z-[2000] bg-black/40 transition-opacity duration-200",
          room ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div
        className={clsx(
          "fixed inset-0 z-[2001] flex items-center justify-center p-4 transition-all duration-200",
          room ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {room && (
          <div className="w-full max-w-[520px] max-h-[85vh] bg-surface rounded-lg shadow-xl flex flex-col overflow-hidden">
            <div className="relative px-6 pt-6 pb-4 border-b border-border-color">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-md text-secondary-text hover:text-primary-text hover:bg-gray-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <h2 className="text-[17px] font-semibold text-primary-text leading-snug pr-8">
                {room.title}
              </h2>
              <div className="flex items-center gap-1.5 text-secondary-text mt-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[13px]">{room.location_name}</span>
              </div>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-2xl font-bold text-primary-text tracking-tight">₹{room.price.toLocaleString("en-IN")}</span>
                <span className="text-[13px] text-secondary-text">/ month</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-secondary-text mt-0.5">
                <span>Deposit: ₹{room.deposit.toLocaleString("en-IN")}</span>
                <span className="text-border-color">·</span>
                <span>{room.property_type}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {room.description && (
                <section>
                  <h3 className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider mb-2">About this room</h3>
                  <p className="text-[13px] text-primary-text leading-relaxed">{room.description}</p>
                </section>
              )}

              {room.amenities.length > 0 && (
                <section>
                  <h3 className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider mb-2.5">Amenities</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {room.amenities.map(amenity => (
                      <span key={amenity} className="px-2.5 py-1 text-[12px] font-medium text-secondary-text bg-accent-light rounded-md">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {room.reviews.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider">Reviews</h3>
                    <span className="text-[12px] font-medium text-primary-text">
                      {(room.reviews.reduce((sum, r) => sum + r.rating, 0) / room.reviews.length).toFixed(1)} ({room.reviews.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {room.reviews.map((review, index) => (
                      <div key={index} className="p-3 bg-accent-light rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] font-medium text-primary-text">{review.username}</span>
                          <span className="text-[11px] text-secondary-text">{review.rating}/5</span>
                        </div>
                        <p className="text-[12px] text-secondary-text leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="border-t border-border-color p-4 flex gap-2">
              <a
                href={`tel:${room.phone}`}
                className="flex-1 flex items-center justify-center gap-2 h-[40px] rounded-lg text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
                style={{ backgroundColor: '#0F172A' }}
              >
                <Phone className="w-3.5 h-3.5" />
                Call
              </a>
              <a
                href={`https://wa.me/${room.whatsapp.replace(/\+/g, "").replace(/\s/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 h-[40px] rounded-lg text-[13px] font-medium text-primary-text border border-border-color hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
