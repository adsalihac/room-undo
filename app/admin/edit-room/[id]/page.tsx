"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Loader2, ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

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

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchRoom = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        router.push("/admin/rooms");
        return;
      }

      setIsAvailable(data.available);
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
      .update({ ...data, available: isAvailable })
      .eq("id", params.id);

    setIsSubmitting(false);

    if (error) {
      alert("Failed to update room: " + error.message);
    } else {
      router.push("/admin/rooms");
      router.refresh();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto pb-20">
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-primary-text/20 border-t-primary-text rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <Link href="/admin/rooms" className="inline-flex items-center gap-1.5 text-[14px] text-secondary-text hover:text-primary-text transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Rooms
        </Link>
        <h1 className="text-2xl font-bold text-primary-text mb-1">Edit Room</h1>
        <p className="text-[15px] text-secondary-text">Update the property details.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-surface p-6 rounded-2xl border border-border-color space-y-5">
          <h2 className="text-[14px] font-semibold text-primary-text">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-[13px] font-medium text-primary-text mb-1.5">Title</label>
              <input
                {...register("title")}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color text-[14px] text-primary-text placeholder:text-secondary-text/60 focus:border-primary-text/30 outline-none transition-all"
              />
              {errors.title && <p className="text-error text-[12px] mt-1">{errors.title.message as string}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-primary-text mb-1.5">Monthly Rent (₹)</label>
              <input
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color text-[14px] text-primary-text focus:border-primary-text/30 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-primary-text mb-1.5">Deposit (₹)</label>
              <input
                type="number"
                {...register("deposit", { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl border border-border-color text-[14px] text-primary-text focus:border-primary-text/30 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-primary-text mb-1.5">Property Type</label>
              <select {...register("property_type")} className="w-full px-4 py-2.5 rounded-xl border border-border-color text-[14px] text-primary-text focus:border-primary-text/30 outline-none transition-all bg-white">
                <option value="Shared Room">Shared Room</option>
                <option value="Private Room">Private Room</option>
                <option value="PG">PG</option>
                <option value="Hostel">Hostel</option>
                <option value="Apartment">Apartment</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-primary-text mb-1.5">Gender Preference</label>
              <select {...register("gender_preference")} className="w-full px-4 py-2.5 rounded-xl border border-border-color text-[14px] text-primary-text focus:border-primary-text/30 outline-none transition-all bg-white">
                <option value="Any">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-primary-text mb-1.5">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-border-color text-[14px] text-primary-text placeholder:text-secondary-text/60 focus:border-primary-text/30 outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border-color space-y-5">
          <h2 className="text-[14px] font-semibold text-primary-text flex items-center gap-2">
            <MapPin className="w-4 h-4 text-secondary-text" />
            Location
          </h2>

          <div>
            <label className="block text-[13px] font-medium text-primary-text mb-1.5">Location Name / Area</label>
            <input
              {...register("location_name")}
              className="w-full px-4 py-2.5 rounded-xl border border-border-color text-[14px] text-primary-text focus:border-primary-text/30 outline-none transition-all"
            />
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border-color space-y-5">
          <h2 className="text-[14px] font-semibold text-primary-text">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[13px] font-medium text-primary-text mb-1.5">Owner Name</label>
              <input {...register("owner_name")} className="w-full px-4 py-2.5 rounded-xl border border-border-color text-[14px] text-primary-text focus:border-primary-text/30 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-primary-text mb-1.5">Phone</label>
              <input {...register("phone")} className="w-full px-4 py-2.5 rounded-xl border border-border-color text-[14px] text-primary-text focus:border-primary-text/30 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-primary-text mb-1.5">WhatsApp</label>
              <input {...register("whatsapp")} className="w-full px-4 py-2.5 rounded-xl border border-border-color text-[14px] text-primary-text focus:border-primary-text/30 outline-none transition-all" />
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border-color space-y-5">
          <h2 className="text-[14px] font-semibold text-primary-text">Status</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 rounded border-border-color text-[#0F172A] focus:ring-[#0F172A]/30"
            />
            <span className="text-[14px] text-primary-text">Available for rent</span>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/rooms" className="flex items-center h-[44px] px-6 rounded-xl text-[14px] font-medium text-primary-text border border-border-color hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 h-[44px] px-6 rounded-xl text-[14px] font-medium text-white disabled:opacity-50 transition-colors"
            style={{ backgroundColor: '#0F172A' }}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
