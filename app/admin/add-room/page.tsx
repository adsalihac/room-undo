"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UploadCloud, MapPin } from "lucide-react";

// In a real app we'd use a separate Map for dropping a pin
const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  price: z.number().min(1, "Price is required"),
  deposit: z.number().min(0, "Deposit must be 0 or more"),
  property_type: z.enum(["Shared Room", "Private Room", "PG", "Hostel", "Apartment"]),
  gender_preference: z.enum(["Male", "Female", "Any"]),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location_name: z.string().min(3, "Location name is required"),
  owner_name: z.string().min(3, "Owner name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  whatsapp: z.string().min(10, "Valid WhatsApp number required"),
});

export default function AddRoom() {
  const [coordinates, setCoordinates] = useState({ lat: 10.8505, lng: 76.2711 });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      property_type: "Private Room",
      gender_preference: "Any",
    }
  });

  const onSubmit = (data: any) => {
    console.log("Submitting:", { ...data, ...coordinates });
    // Handle Supabase insert here
    alert("Room successfully added!");
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-text mb-2">Add New Room</h1>
        <p className="text-secondary-text">Fill in the details below to list a new property on the map.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-color space-y-6">
          <h2 className="text-xl font-bold text-primary-text">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary-text mb-2">Title</label>
              <input 
                {...register("title")}
                placeholder="e.g. Premium 1BHK near Technopark"
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:border-success focus:ring-2 focus:ring-success/20 outline-none transition-all"
              />
              {errors.title && <p className="text-error text-xs mt-1">{errors.title.message as string}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">Monthly Rent (₹)</label>
                <input 
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:border-success focus:ring-2 focus:ring-success/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">Deposit (₹)</label>
                <input 
                  type="number"
                  {...register("deposit", { valueAsNumber: true })}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:border-success focus:ring-2 focus:ring-success/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-text mb-2">Property Type</label>
              <select 
                {...register("property_type")}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:border-success focus:ring-2 focus:ring-success/20 outline-none transition-all bg-white"
              >
                <option value="Shared Room">Shared Room</option>
                <option value="Private Room">Private Room</option>
                <option value="PG">PG</option>
                <option value="Hostel">Hostel</option>
                <option value="Apartment">Apartment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-text mb-2">Gender Preference</label>
              <select 
                {...register("gender_preference")}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:border-success focus:ring-2 focus:ring-success/20 outline-none transition-all bg-white"
              >
                <option value="Any">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-2">Description</label>
            <textarea 
              {...register("description")}
              rows={4}
              placeholder="Describe the property, surroundings, and house rules..."
              className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:border-success focus:ring-2 focus:ring-success/20 outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Location & Map */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-color space-y-6">
          <h2 className="text-xl font-bold text-primary-text flex items-center gap-2">
            <MapPin className="w-5 h-5 text-secondary-text" />
            Location
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-primary-text mb-2">Location Name / Area</label>
            <input 
              {...register("location_name")}
              placeholder="e.g. Kazhakkoottam, Trivandrum"
              className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:border-success focus:ring-2 focus:ring-success/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-2">Pin Location on Map</label>
            <div className="w-full h-80 bg-gray-100 rounded-xl overflow-hidden border border-border-color relative">
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <MapPin className="w-8 h-8 text-error -mt-8 drop-shadow-md" />
              </div>
              {/* In a real scenario, map dragging updates the coordinates */}
              <MapComponent rooms={[]} onRoomSelect={() => {}} />
            </div>
            <p className="text-xs text-secondary-text mt-2">
              Drag the map to place the pin exactly at the property location.
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-color space-y-6">
          <h2 className="text-xl font-bold text-primary-text">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary-text mb-2">Owner Name</label>
              <input 
                {...register("owner_name")}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:border-success focus:ring-2 focus:ring-success/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-2">Phone Number</label>
              <input 
                {...register("phone")}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:border-success focus:ring-2 focus:ring-success/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-2">WhatsApp Number</label>
              <input 
                {...register("whatsapp")}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color focus:border-success focus:ring-2 focus:ring-success/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-color space-y-6">
          <h2 className="text-xl font-bold text-primary-text">Photos</h2>
          
          <div className="border-2 border-dashed border-border-color rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors group">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-primary-text mb-1">Click to upload photos</h3>
            <p className="text-sm text-secondary-text">PNG, JPG or WEBP (max. 5MB)</p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" className="px-6 py-3 rounded-xl font-medium text-primary-text hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-8 py-3 rounded-xl font-bold bg-success text-white hover:bg-success/90 transition-colors shadow-md">
            Publish Room
          </button>
        </div>

      </form>
    </div>
  );
}
