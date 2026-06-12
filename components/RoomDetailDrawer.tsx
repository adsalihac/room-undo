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
    <div 
      className={clsx(
        "fixed inset-y-0 right-0 z-[2000] w-full sm:w-[480px] bg-white border-l border-border-color transform transition-transform duration-250 ease-out flex flex-col",
        room ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-border-color text-primary-text hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {room && (
        <>
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 pb-28">
            <div className="mb-8">
              <h2 className="text-[18px] font-semibold text-primary-text leading-snug mb-3">
                {room.title}
              </h2>

              <div className="flex items-center gap-1.5 text-secondary-text mb-5">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="text-[15px]">{room.location_name}</span>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-primary-text tracking-tight">₹{room.price.toLocaleString("en-IN")}</span>
                <span className="text-[15px] text-secondary-text">/ month</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] text-secondary-text">
                <span>Deposit: ₹{room.deposit.toLocaleString("en-IN")}</span>
                <span className="text-border-color">·</span>
                <span>{room.property_type}</span>
              </div>
            </div>

            <div className="space-y-8">
              {/* Description */}
              <section>
                <h3 className="text-[12px] font-semibold text-secondary-text uppercase tracking-[0.12em] mb-3">About this room</h3>
                <p className="text-[15px] text-primary-text leading-relaxed">
                  {room.description}
                </p>
              </section>

              {/* Amenities */}
              {room.amenities.length > 0 && (
                <section>
                  <h3 className="text-[12px] font-semibold text-secondary-text uppercase tracking-[0.12em] mb-4">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map(amenity => (
                      <div key={amenity} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-xl border border-border-color text-[14px]">
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[12px] font-semibold text-secondary-text uppercase tracking-[0.12em]">Reviews</h3>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-primary-text fill-current" />
                      <span className="text-[14px] font-semibold text-primary-text">
                        {(room.reviews.reduce((sum, r) => sum + r.rating, 0) / room.reviews.length).toFixed(1)}
                      </span>
                      <span className="text-[13px] text-secondary-text">({room.reviews.length})</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {room.reviews.map((review, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[14px] font-medium text-primary-text">{review.username}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: review.rating }, (_, i) => (
                              <Star key={i} className="w-3 h-3 text-primary-text fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[14px] text-secondary-text leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-border-color p-4 flex gap-3">
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
        </>
      )}
    </div>
  );
}
