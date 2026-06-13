"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Loader2, ArrowLeft, X } from "lucide-react";
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
  const [isFeatured, setIsFeatured] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [tagInput, setTagInput] = useState("");
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
      setIsFeatured(data.featured ?? false);
      setAmenities(data.amenities || []);
      setTags(data.tags || []);
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
        featured: isFeatured,
        amenities,
        tags,
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
      <div className="max-w-3xl mx-auto pb-20">
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-[4px] border-accent/20 border-t-accent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-8">
        <Link href="/admin/rooms" className="inline-flex items-center gap-1.5 text-[14px] font-extrabold transition-all hover:-translate-y-0.5 mb-4" style={{ color: "#FF385C" }}>
          <ArrowLeft className="w-4.5 h-4.5" />
          Back to Rooms
        </Link>
        <h1 className="text-2xl font-extrabold text-primary-text">Edit Room</h1>
        <p className="text-[14px] text-secondary-text font-bold mt-0.5">Update the property details.</p>
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
              className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background"
            />
            {errors.title && <p className="text-error text-[13px] font-bold mt-1">{errors.title.message as string}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">Monthly Rent (₹)</label>
              <input
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background"
              />
            </div>
            <div>
              <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">Deposit (₹)</label>
              <input
                type="number"
                {...register("deposit", { valueAsNumber: true })}
                className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background"
              />
            </div>
            <div>
              <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">Property Type</label>
              <select {...register("property_type")} className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background">
                <option value="Shared Room">Shared Room</option>
                <option value="Private Room">Private Room</option>
                <option value="PG">PG</option>
                <option value="Hostel">Hostel</option>
                <option value="Apartment">Apartment</option>
              </select>
            </div>
            <div>
              <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">Gender Preference</label>
              <select {...register("gender_preference")} className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background">
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
              className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all resize-none bg-background"
            />
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
              className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background"
            />
          </div>

          <div>
            <label className="block text-[14px] font-extrabold text-primary-text mb-2">Pin Location on Map</label>
            <div className="w-full h-72 rounded-2xl overflow-hidden border-2 border-border-color shadow-sm relative">
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <MapPin className="w-8 h-8 -mt-8 drop-shadow-lg" style={{ color: "#FF385C" }} />
              </div>
              <LocationPicker center={coordinates} onCenterChange={(c) => setCoordinates(c)} />
            </div>
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
              <input {...register("owner_name")} className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background" />
            </div>
            <div>
              <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">Phone</label>
              <input {...register("phone")} className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background" />
            </div>
            <div>
              <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">WhatsApp</label>
              <input {...register("whatsapp")} className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background" />
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border-2 border-border-color/50 shadow-lg space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-border-color/40">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#00A699" }} />
            <h2 className="text-[14px] font-extrabold text-primary-text uppercase tracking-wider">Features &amp; Amenities</h2>
          </div>

          <div>
            <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">Amenities</label>
            <p className="text-[12px] text-secondary-text font-bold mb-2">Type an amenity and press Enter to add it.</p>
            <div className="flex flex-wrap gap-2 mb-2.5">
              {amenities.map((a) => (
                <span key={a} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-extrabold bg-accent-light text-accent">
                  {a}
                  <button onClick={() => setAmenities((prev) => prev.filter((x) => x !== a))} className="p-0.5 rounded-full hover:bg-accent/20 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val = amenityInput.trim();
                  if (val && !amenities.includes(val)) {
                    setAmenities((prev) => [...prev, val]);
                    setAmenityInput("");
                  }
                }
              }}
              placeholder="e.g. WiFi, AC, Parking, Geyser"
              className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold placeholder:text-gray-400 outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background"
            />
          </div>

          <div>
            <label className="block text-[14px] font-extrabold text-primary-text mb-1.5">Tags</label>
            <p className="text-[12px] text-secondary-text font-bold mb-2">Useful labels like &quot;Near Metro&quot;, &quot;Bachelor Friendly&quot;, etc.</p>
            <div className="flex flex-wrap gap-2 mb-2.5">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-extrabold" style={{ backgroundColor: "#EBF4FF", color: "#428BFF" }}>
                  {t}
                  <button onClick={() => setTags((prev) => prev.filter((x) => x !== t))} className="p-0.5 rounded-full opacity-60 hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val = tagInput.trim();
                  if (val && !tags.includes(val)) {
                    setTags((prev) => [...prev, val]);
                    setTagInput("");
                  }
                }
              }}
              placeholder="e.g. Near Metro, Bachelor Friendly, Gated Security"
              className="w-full px-4 py-3 rounded-xl border-2 border-border-color text-[14px] text-primary-text font-bold placeholder:text-gray-400 outline-none focus:border-accent/40 focus:ring-3 focus:ring-accent/10 transition-all bg-background"
            />
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border-2 border-border-color/50 shadow-lg space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-border-color/40">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#FF385C" }} />
            <h2 className="text-[14px] font-extrabold text-primary-text uppercase tracking-wider">Status</h2>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-5 h-5 rounded border-border-color focus:ring-accent/30"
              style={{ accentColor: "#FF385C" }}
            />
            <span className="text-[15px] font-extrabold text-primary-text">Available for rent</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 rounded border-border-color focus:ring-accent/30"
              style={{ accentColor: "#FF385C" }}
            />
            <span className="text-[15px] font-extrabold text-primary-text">Featured listing</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/admin/rooms" className="inline-flex items-center h-[48px] px-8 rounded-full text-[15px] font-extrabold border-2 transition-all hover:-translate-y-0.5 active:translate-y-0" style={{ borderColor: "#E5E5E5", color: "#2B2B2B" }}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 h-[48px] px-8 rounded-full text-[15px] font-extrabold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
            style={{ backgroundColor: "#FF385C" }}
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
