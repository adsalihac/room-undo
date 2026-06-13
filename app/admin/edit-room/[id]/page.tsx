"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Loader2, ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

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
  available: z.boolean().optional(),
});

export default function EditRoom() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [coordinates, setCoordinates] = useState({ lat: 10.8505, lng: 76.2711 });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchRoom = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*, room_images(id, image_url)")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        router.push("/admin/rooms");
        return;
      }

      setIsAvailable(data.available);
      setCoordinates({ lat: data.latitude, lng: data.longitude });
      reset({
        title: data.title,
        price: data.price,
        deposit: data.deposit,
        property_type: data.property_type,
        gender_preference: data.gender_preference,
        description: data.description,
        location_name: data.location_name,
        owner_name: data.owner_name,
        phone: data.phone,
        whatsapp: data.whatsapp,
      });
      setIsLoading(false);
    };

    fetchRoom();
  }, [params.id, reset, supabase, router]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    const { error } = await supabase
      .from("rooms")
      .update({
        ...data,
        available: isAvailable,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      })
      .eq("id", params.id);

    if (error) {
      setIsSubmitting(false);
      alert("Failed to update room: " + error.message);
      return;
    }

    setIsSubmitting(false);
    router.push("/admin/rooms");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto pb-16">
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 border-2 border-primary-text/20 border-t-primary-text rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <div className="mb-6">
        <Link href="/admin/rooms" className="inline-flex items-center gap-1 text-[12px] text-secondary-text hover:text-primary-text transition-colors mb-3">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Rooms
        </Link>
        <h1 className="text-xl font-bold text-primary-text">Edit Room</h1>
        <p className="text-[13px] text-secondary-text mt-0.5">Update the property details.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="bg-surface p-5 rounded-lg border border-border-color space-y-4">
          <h2 className="text-[13px] font-semibold text-primary-text">Basic Information</h2>

          <div>
            <label className="block text-[12px] font-medium text-primary-text mb-1">Title</label>
            <input
              {...register("title")}
              className="w-full px-3 py-2 rounded-lg border border-border-color text-[13px] text-primary-text placeholder:text-gray-400 outline-none focus:border-accent/30 transition-colors"
            />
            {errors.title && <p className="text-error text-[11px] mt-1">{errors.title.message as string}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-primary-text mb-1">Monthly Rent (₹)</label>
              <input
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="w-full px-3 py-2 rounded-lg border border-border-color text-[13px] text-primary-text outline-none focus:border-accent/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-primary-text mb-1">Deposit (₹)</label>
              <input
                type="number"
                {...register("deposit", { valueAsNumber: true })}
                className="w-full px-3 py-2 rounded-lg border border-border-color text-[13px] text-primary-text outline-none focus:border-accent/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-primary-text mb-1">Property Type</label>
              <select {...register("property_type")} className="w-full px-3 py-2 rounded-lg border border-border-color text-[13px] text-primary-text outline-none focus:border-accent/30 transition-colors bg-surface">
                <option value="Shared Room">Shared Room</option>
                <option value="Private Room">Private Room</option>
                <option value="PG">PG</option>
                <option value="Hostel">Hostel</option>
                <option value="Apartment">Apartment</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-primary-text mb-1">Gender Preference</label>
              <select {...register("gender_preference")} className="w-full px-3 py-2 rounded-lg border border-border-color text-[13px] text-primary-text outline-none focus:border-accent/30 transition-colors bg-surface">
                <option value="Any">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-primary-text mb-1">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border-color text-[13px] text-primary-text placeholder:text-gray-400 outline-none focus:border-accent/30 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="bg-surface p-5 rounded-lg border border-border-color space-y-4">
          <h2 className="text-[13px] font-semibold text-primary-text flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-secondary-text" />
            Location
          </h2>

          <div>
            <label className="block text-[12px] font-medium text-primary-text mb-1">Location Name / Area</label>
            <input
              {...register("location_name")}
              className="w-full px-3 py-2 rounded-lg border border-border-color text-[13px] text-primary-text outline-none focus:border-accent/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-primary-text mb-1.5">Pin Location on Map</label>
            <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-border-color relative">
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <MapPin className="w-6 h-6 text-primary-text -mt-6 drop-shadow-sm" />
              </div>
              <LocationPicker
                center={coordinates}
                onCenterChange={(c) => setCoordinates(c)}
              />
            </div>
          </div>
        </div>

        <div className="bg-surface p-5 rounded-lg border border-border-color space-y-4">
          <h2 className="text-[13px] font-semibold text-primary-text">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-primary-text mb-1">Owner Name</label>
              <input {...register("owner_name")} className="w-full px-3 py-2 rounded-lg border border-border-color text-[13px] text-primary-text outline-none focus:border-accent/30 transition-colors" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-primary-text mb-1">Phone</label>
              <input {...register("phone")} className="w-full px-3 py-2 rounded-lg border border-border-color text-[13px] text-primary-text outline-none focus:border-accent/30 transition-colors" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-primary-text mb-1">WhatsApp</label>
              <input {...register("whatsapp")} className="w-full px-3 py-2 rounded-lg border border-border-color text-[13px] text-primary-text outline-none focus:border-accent/30 transition-colors" />
            </div>
          </div>
        </div>

        <div className="bg-surface p-5 rounded-lg border border-border-color space-y-4">
          <h2 className="text-[13px] font-semibold text-primary-text">Status</h2>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 rounded border-border-color text-accent focus:ring-accent/30"
            />
            <span className="text-[13px] text-primary-text">Available for rent</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Link href="/admin/rooms" className="inline-flex items-center h-[38px] px-4 rounded-lg text-[13px] font-medium text-primary-text border border-border-color hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 h-[38px] px-4 rounded-lg text-[13px] font-medium text-white disabled:opacity-50 transition-colors hover:bg-accent-hover"
            style={{ backgroundColor: '#0F172A' }}
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
