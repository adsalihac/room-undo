"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import clsx from "clsx";

export default function FilterPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [propertyType, setPropertyType] = useState("All");

  const types = ["All", "Shared Room", "Private Room", "PG", "Hostel", "Apartment"];

  return (
    <div className="absolute top-24 left-4 z-[1000] pointer-events-none">
      <div className="pointer-events-auto bg-white rounded-2xl shadow-lg border border-border-color overflow-hidden w-64 md:w-80 transition-all duration-300">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary-text" />
            <span className="font-semibold text-primary-text">Filters</span>
          </div>
          <ChevronDown className={clsx("w-5 h-5 text-secondary-text transition-transform duration-300", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="p-4 border-t border-border-color bg-white flex flex-col gap-6">
            
            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-primary-text mb-3">Price Range</label>
              <div className="flex items-center justify-between gap-2 text-sm text-secondary-text mb-2">
                <span>₹3,000</span>
                <span>₹25,000+</span>
              </div>
              <input 
                type="range" 
                min="3000" 
                max="25000" 
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-success"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-semibold text-primary-text mb-3">Property Type</label>
              <div className="flex flex-wrap gap-2">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setPropertyType(type)}
                    className={clsx(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                      propertyType === type 
                        ? "bg-primary-text text-white border-primary-text" 
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
              <label className="block text-sm font-semibold text-primary-text mb-3">Gender Preference</label>
              <div className="flex gap-2">
                {["Any", "Male", "Female"].map((gender) => (
                  <label key={gender} className="flex-1">
                    <input type="radio" name="gender" value={gender} className="peer sr-only" defaultChecked={gender === "Any"} />
                    <div className="text-center px-3 py-2 rounded-xl text-sm font-medium border border-border-color cursor-pointer text-secondary-text peer-checked:bg-success/10 peer-checked:text-success peer-checked:border-success/30 hover:bg-gray-50 transition-all">
                      {gender}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full bg-primary-text text-white rounded-xl py-3 font-semibold hover:bg-primary-text/90 transition-colors shadow-md mt-2">
              Apply Filters
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
