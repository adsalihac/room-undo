"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import clsx from "clsx";

export default function FilterPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [propertyType, setPropertyType] = useState("All");

  const types = ["All", "Shared Room", "Private Room", "PG", "Hostel", "Apartment"];

  return (
    <div className="fixed top-24 left-4 z-[1000] pointer-events-none">
      <div className="pointer-events-auto bg-white rounded-2xl border border-border-color shadow-sm overflow-hidden w-64 md:w-72 transition-all duration-200">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary-text" />
            <span className="text-[14px] font-medium text-primary-text">Filters</span>
          </div>
          <ChevronDown className={clsx("w-4 h-4 text-secondary-text transition-transform duration-200", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="px-4 pb-5 pt-1 border-t border-border-color space-y-6">
            {/* Price Range */}
            <div>
              <label className="block text-[12px] font-semibold text-secondary-text uppercase tracking-[0.12em] mb-3">Price Range</label>
              <div className="flex items-center justify-between text-[13px] text-secondary-text mb-2">
                <span>₹3,000</span>
                <span>₹25,000+</span>
              </div>
              <input type="range" min="3000" max="25000" />
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-[12px] font-semibold text-secondary-text uppercase tracking-[0.12em] mb-3">Property Type</label>
              <div className="flex flex-wrap gap-1.5">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setPropertyType(type)}
                    className={clsx(
                      "px-3 py-1.5 rounded-xl text-[13px] font-medium transition-colors border",
                      propertyType === type 
                        ? "bg-[#0F172A] text-white border-[#0F172A]" 
                        : "bg-white text-secondary-text border-border-color hover:border-primary-text hover:text-primary-text"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Preference */}
            <div>
              <label className="block text-[12px] font-semibold text-secondary-text uppercase tracking-[0.12em] mb-3">Gender</label>
              <div className="flex gap-2">
                {["Any", "Male", "Female"].map((gender) => (
                  <label key={gender} className="flex-1">
                    <input type="radio" name="gender" value={gender} className="peer sr-only" defaultChecked={gender === "Any"} />
                    <div className="text-center px-3 py-2 rounded-xl text-[13px] font-medium border border-border-color cursor-pointer text-secondary-text peer-checked:bg-gray-100 peer-checked:text-primary-text peer-checked:border-primary-text hover:bg-gray-50 transition-all">
                      {gender}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full h-[40px] rounded-xl text-[14px] font-medium text-white transition-colors" style={{ backgroundColor: '#0F172A' }}>
              Apply Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
