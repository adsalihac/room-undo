"use client";

import { useState, useRef } from "react";
import { X, MapPin, Phone, MessageCircle, Star, Share2, ChevronLeft, ChevronRight, Home } from "lucide-react";
import clsx from "clsx";
import type { Room } from "./MapComponent";

interface RoomDetailDrawerProps {
  room: Room | null;
  onClose: () => void;
}

export default function RoomDetailDrawer({ room, onClose }: RoomDetailDrawerProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!room) return null;

  const images = room.images.length > 0 ? room.images : room.image_url ? [room.image_url] : [];
  const hasMultiple = images.length > 1;

  const prevImage = () => setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const shareText = `🏠 *${room.title}*\n📍 ${room.location_name}\n💰 ₹${room.price.toLocaleString("en-IN")}/mo\n📋 ${room.property_type}\n\nCheck it out on RoomUndo!`;

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
        <div className="w-full max-w-[540px] max-h-[88vh] bg-surface rounded-3xl shadow-2xl shadow-black/10 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="relative h-2 w-full shrink-0" style={{ backgroundColor: "#FF385C" }} />

          <div className="relative px-7 pt-6 pb-5">
            <div className="absolute top-5 right-5 flex items-center gap-1.5 z-10">
              <button
                onClick={() => {
                  const text = encodeURIComponent(shareText);
                  window.open(`https://wa.me/?text=${text}`, "_blank");
                }}
                className="w-9 h-9 flex items-center justify-center rounded-full text-secondary-text hover:text-accent hover:bg-accent-light transition-colors"
                title="Share via WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full text-secondary-text hover:text-accent hover:bg-accent-light transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <h2 className="text-[22px] font-extrabold text-primary-text leading-tight pr-20">
              {room.title}
            </h2>
            <div className="flex items-center gap-1.5 text-secondary-text mt-1.5">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="text-[14px] font-bold">{room.location_name}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-3xl font-extrabold text-primary-text tracking-tight">
                ₹{room.price.toLocaleString("en-IN")}
              </span>
              <span className="text-[14px] text-secondary-text font-bold">/ month</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-secondary-text mt-1.5">
              <span className="px-3 py-1 rounded-full text-[12px] font-extrabold" style={{ backgroundColor: "#FFF4E0", color: "#FF9600" }}>
                Deposit: ₹{room.deposit.toLocaleString("en-IN")}
              </span>
              <span className="text-border-color">·</span>
              <span className="font-bold">{room.property_type}</span>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-7 pb-6 space-y-6">
            {/* Image gallery */}
            {images.length > 0 && (
              <section>
                <div className="relative rounded-2xl overflow-hidden border-2 border-border-color/50 bg-background">
                  <img
                    src={images[imgIndex]}
                    alt={room.title}
                    className="w-full h-52 object-cover"
                  />
                  {hasMultiple && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 text-primary-text" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-primary-text" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setImgIndex(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              i === imgIndex ? "w-4 bg-white" : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </section>
            )}

            {room.description && (
              <section>
                <h3 className="text-[12px] font-extrabold text-secondary-text uppercase tracking-wider mb-2.5">
                  About this room
                </h3>
                <p className="text-[14px] text-primary-text leading-relaxed font-semibold">{room.description}</p>
              </section>
            )}

            {room.amenities.length > 0 && (
              <section>
                <h3 className="text-[12px] font-extrabold text-secondary-text uppercase tracking-wider mb-3">
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map(amenity => (
                    <span
                      key={amenity}
                      className="px-3.5 py-1.5 text-[13px] font-extrabold rounded-full border-2"
                      style={{ borderColor: "#DDDDDD", color: "#222222", backgroundColor: "#F7F7F7" }}
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
                  <h3 className="text-[12px] font-extrabold text-secondary-text uppercase tracking-wider">
                    Reviews
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4" style={{ color: "#FF9600", fill: "#FF9600" }} />
                    <span className="text-[14px] font-extrabold text-primary-text">
                      {(room.reviews.reduce((sum, r) => sum + r.rating, 0) / room.reviews.length).toFixed(1)}
                    </span>
                    <span className="text-[12px] font-bold text-secondary-text">({room.reviews.length})</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {room.reviews.map((review, index) => (
                    <div key={index} className="p-4 rounded-2xl border-2" style={{ borderColor: "#DDDDDD", backgroundColor: "#F7F7F7" }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[14px] font-extrabold text-primary-text">{review.username}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: review.rating }, (_, i) => (
                            <Star key={i} className="w-3.5 h-3.5" style={{ color: "#FF9600", fill: "#FF9600" }} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[13px] text-secondary-text leading-relaxed font-semibold">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Action buttons */}
          <div className="border-t border-border-color p-4 flex gap-2.5" style={{ backgroundColor: "#F7F7F7" }}>
            <a
              href={`tel:${room.phone}`}
              className="flex-1 flex items-center justify-center gap-2 h-[48px] rounded-full text-[15px] font-extrabold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              style={{ backgroundColor: "#FF385C" }}
            >
              <Phone className="w-4.5 h-4.5" />
              Call Owner
            </a>
            <a
              href={`https://wa.me/${room.whatsapp.replace(/\+/g, "").replace(/\s/g, "")}?text=${encodeURIComponent("Hi, I'm interested in " + room.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 h-[48px] rounded-full text-[15px] font-extrabold border-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
              style={{ borderColor: "#DDDDDD", color: "#222222", backgroundColor: "#FFFFFF" }}
            >
              <MessageCircle className="w-4.5 h-4.5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
