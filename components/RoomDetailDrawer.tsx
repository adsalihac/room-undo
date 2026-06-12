"use client";

import { X, MapPin, Phone, MessageCircle, Star, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import type { Room } from "./MapComponent";
import Image from "next/image";

interface RoomDetailDrawerProps {
  room: Room | null;
  onClose: () => void;
}

export default function RoomDetailDrawer({ room, onClose }: RoomDetailDrawerProps) {
  return (
    <div 
      className={clsx(
        "fixed inset-y-0 right-0 z-[2000] w-full sm:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col",
        room ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Drawer Header */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={onClose}
          className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md text-primary-text hover:bg-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {room && (
        <>
          {/* Image Area */}
          <div className="relative w-full h-64 bg-gray-200 shrink-0">
            {/* Ideally we use Next Image here, but we'll use a placeholder colored div or img for now */}
            <img 
              src={room.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80"} 
              alt={room.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4">
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-semibold text-primary-text shadow-sm">
                {room.property_type}
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 pb-24">
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-primary-text leading-tight mb-2">
                {room.title}
              </h2>
              
              <div className="flex items-center gap-1.5 text-secondary-text mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{room.location_name}</span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-primary-text">₹{room.price.toLocaleString("en-IN")}</span>
                <span className="text-secondary-text">/ month</span>
              </div>
              <p className="text-sm text-secondary-text">Deposit: ₹{room.deposit.toLocaleString("en-IN")}</p>
            </div>

            <hr className="border-border-color mb-6" />

            {/* Amenities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-primary-text mb-4">Amenities</h3>
              <div className="flex flex-wrap gap-3">
                {room.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-border-color">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium text-primary-text">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-border-color mb-6" />

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-primary-text mb-3">About this room</h3>
              <p className="text-secondary-text text-sm leading-relaxed">
                {room.description}
              </p>
            </div>

            <hr className="border-border-color mb-6" />

            {/* Reviews */}
            {room.reviews.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-primary-text">Reviews</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold text-primary-text">
                      {(room.reviews.reduce((sum, r) => sum + r.rating, 0) / room.reviews.length).toFixed(1)}
                    </span>
                    <span className="text-secondary-text text-sm">({room.reviews.length})</span>
                  </div>
                </div>

                {room.reviews.map((review, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-2xl mb-3 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-primary-text">{review.username}</span>
                      <div className="flex">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-secondary-text">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
            
          </div>

          {/* Sticky Action Footer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-border-color p-4 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <a href={`tel:${room.phone}`} className="flex-1 bg-primary-text text-white rounded-xl py-3.5 font-semibold hover:bg-primary-text/90 transition-colors flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Call Owner
            </a>
            <a href={`https://wa.me/${room.whatsapp.replace(/\+/g, "").replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-success text-white rounded-xl py-3.5 font-semibold hover:bg-success/90 transition-colors flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </>
      )}
    </div>
  );
}
