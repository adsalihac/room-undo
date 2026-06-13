"use client";

import { X, Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import type { Room } from "./MapComponent";

interface CompareModalProps {
  rooms: Room[];
  onClose: () => void;
}

export default function CompareModal({ rooms, onClose }: CompareModalProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-[3000] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[3001] flex items-center justify-center p-4">
        <div
          className="w-full max-w-[900px] max-h-[90vh] bg-surface rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 py-5 border-b border-border-color/70 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-[18px] font-extrabold text-primary-text">Compare Rooms</h2>
              <p className="text-[13px] font-bold text-secondary-text mt-0.5">{rooms.length} rooms selected</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full text-secondary-text hover:text-accent hover:bg-accent-light transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Comparison table — horizontally scrollable on mobile */}
          <div className="flex-1 overflow-x-auto overflow-y-auto px-6 py-5">
            <div className="flex gap-4 min-w-0" style={{ width: `max(${rooms.length * 280}px, 100%)` }}>
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="flex-1 min-w-[260px] max-w-[320px] rounded-2xl border-2 border-border-color/70 bg-surface overflow-hidden shrink-0"
                >
                  {/* Image */}
                  <div className="h-36 bg-background overflow-hidden">
                    {room.images.length > 0 || room.image_url ? (
                      <img
                        src={room.images[0] || room.image_url}
                        alt={room.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary-text font-bold text-[13px]">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-3.5">
                    <div>
                      <h3 className="text-[15px] font-extrabold text-primary-text leading-tight">{room.title}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 shrink-0 text-secondary-text" />
                        <span className="text-[12px] text-secondary-text font-medium truncate">{room.location_name}</span>
                      </div>
                    </div>

                    {/* Price row */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-extrabold text-primary-text">₹{room.price.toLocaleString("en-IN")}</span>
                      <span className="text-[12px] text-secondary-text font-bold">/mo</span>
                    </div>

                    {/* Deposit */}
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-bold text-secondary-text">Deposit</span>
                      <span className="text-[13px] font-extrabold text-primary-text">₹{room.deposit.toLocaleString("en-IN")}</span>
                    </div>

                    {/* Type */}
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-bold text-secondary-text">Type</span>
                      <span className="text-[13px] font-semibold text-primary-text">{room.property_type}</span>
                    </div>

                    {/* Gender preference */}
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-bold text-secondary-text">Gender</span>
                      <span className="text-[13px] font-semibold text-primary-text">{room.gender_preference}</span>
                    </div>

                    {/* Availability */}
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-bold text-secondary-text">Status</span>
                      <span className={`text-[13px] font-extrabold ${room.available ? "text-accent" : "text-secondary-text"}`}>
                        {room.available ? "Available" : "Occupied"}
                      </span>
                    </div>

                    {/* Amenities */}
                    {room.amenities.length > 0 && (
                      <div>
                        <span className="text-[12px] font-bold text-secondary-text block mb-1.5">Amenities</span>
                        <div className="flex flex-wrap gap-1">
                          {room.amenities.slice(0, 4).map((a) => (
                            <span
                              key={a}
                              className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-background text-secondary-text border border-border-color"
                            >
                              {a}
                            </span>
                          ))}
                          {room.amenities.length > 4 && (
                            <span className="text-[11px] font-bold text-secondary-text px-1">+{room.amenities.length - 4}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Rating */}
                    {room.reviews.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5" style={{ color: "#FF9600", fill: "#FF9600" }} />
                        <span className="text-[13px] font-extrabold text-primary-text">
                          {(room.reviews.reduce((s, r) => s + r.rating, 0) / room.reviews.length).toFixed(1)}
                        </span>
                        <span className="text-[11px] font-bold text-secondary-text">({room.reviews.length})</span>
                      </div>
                    )}

                    {/* Owner */}
                    <div className="pt-2 border-t border-border-color/50">
                      <span className="text-[12px] font-bold text-secondary-text">Owner</span>
                      <p className="text-[13px] font-semibold text-primary-text mt-0.5">{room.owner_name || "N/A"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
