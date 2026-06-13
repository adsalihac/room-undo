"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), { ssr: false });

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      property_type: "Private Room",
      gender_preference: "Any",
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    const payload = {
      ...data,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      available: true,
    };

    const { error } = await supabase.from("rooms").insert([payload]);

    setIsSubmitting(false);

    if (error) {
      alert("Failed to add room: " + error.message);
    } else {
      router.push("/admin/rooms");
      router.refresh();
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-primary-text">Add Room</h1>
        <p className="text-[14px] text-secondary-text font-bold mt-0.5">Fill in the details to list a new property.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-surface p-6 rounded-2xl border-2 border-border-color/50 shadow-lg space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-border-color/40">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#FF385C" }} />
            <h2 className="text-[14px] font-extrabold text-primary-text uppercase tracking-wider">Basic Information</h2>
          </div>

          <div>
            <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">Title</label>
            <input
              {...register("title")}
              placeholder="e.g. Premium 1BHK near Technopark"
              className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold placeholder:text-gray-400 outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background"
            />
            {errors.title && <p className="text-error text-[13px] font-bold mt-1">{errors.title.message as string}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">Monthly Rent (₹)</label>
              <input
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold placeholder:text-gray-400 outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background"
              />
            </div>
            <div>
              <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">Deposit (₹)</label>
              <input
                type="number"
                {...register("deposit", { valueAsNumber: true })}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold placeholder:text-gray-400 outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background"
              />
            </div>
            <div>
              <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">Property Type</label>
              <select
                {...register("property_type")}
                className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background"
              >
                <option value="Shared Room">Shared Room</option>
                <option value="Private Room">Private Room</option>
                <option value="PG">PG</option>
                <option value="Hostel">Hostel</option>
                <option value="Apartment">Apartment</option>
              </select>
            </div>
            <div>
              <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">Gender Preference</label>
              <select
                {...register("gender_preference")}
                className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background"
              >
                <option value="Any">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Describe the property, surroundings, and house rules..."
              className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold placeholder:text-gray-400 outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all resize-none bg-background"
            />
            {errors.description && <p className="text-error text-[13px] font-bold mt-1">{errors.description.message as string}</p>}
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border-2 border-border-color/50 shadow-lg space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-border-color/40">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#428BFF" }} />
            <h2 className="text-[14px] font-extrabold text-primary-text uppercase tracking-wider">Location</h2>
          </div>

          <div>
            <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">Location Name / Area</label>
            <input
              {...register("location_name")}
              placeholder="e.g. Kazhakkoottam, Trivandrum"
              className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold placeholder:text-gray-400 outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background"
            />
            {errors.location_name && <p className="text-error text-[13px] font-bold mt-1">{errors.location_name.message as string}</p>}
          </div>

          <div>
            <label className="block text-[14px] font-extrabold text-primary-text mb-2">Pin Location on Map</label>
            <div className="w-full h-72 rounded-2xl overflow-hidden border-2 border-border-color shadow-sm relative">
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <MapPin className="w-8 h-8 -mt-8 drop-shadow-lg" style={{ color: "#FF385C" }} />
              </div>
              <LocationPicker center={coordinates} onCenterChange={(c) => setCoordinates(c)} />
            </div>
            <p className="text-[13px] text-secondary-text mt-1.5 font-bold">Drag the map to place the pin at the property location.</p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border-2 border-border-color/50 shadow-lg space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-border-color/40">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#FF385C" }} />
            <h2 className="text-[14px] font-extrabold text-primary-text uppercase tracking-wider">Contact Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">Owner Name</label>
              <input
                {...register("owner_name")}
                placeholder="Owner name"
                className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold placeholder:text-gray-400 outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background"
              />
            </div>
            <div>
              <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">Phone</label>
              <input
                {...register("phone")}
                placeholder="Phone number"
                className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold placeholder:text-gray-400 outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background"
              />
            </div>
            <div>
              <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">WhatsApp</label>
              <input
                {...register("whatsapp")}
                placeholder="WhatsApp number"
                className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold placeholder:text-gray-400 outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="h-[48px] px-8 rounded-full text-[15px] font-extrabold border-2 transition-all hover:-translate-y-0.5 active:translate-y-0" style={{ borderColor: "#E5E5E5", color: "#2B2B2B" }}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 h-[48px] px-8 rounded-full text-[15px] font-extrabold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
            style={{ backgroundColor: "#FF385C" }}
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Publish Room
          </button>
        </div>
      </form>
    </div>
  );
}
