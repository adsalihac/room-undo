import { createClient } from "@/utils/supabase/server";
import { Star, MessageSquareText, MapPin, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default async function PublicReviewsPage() {
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, rooms(title, location_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-full bg-background h-full w-full overflow-y-auto">
      <div className="sticky top-0 z-10 bg-surface border-b-2 border-border-color/50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-[14px] font-extrabold transition-all hover:-translate-y-0.5" style={{ color: "#FF385C" }}>
              <ChevronLeft className="w-4.5 h-4.5" />
              Back
            </Link>
          </div>
          <Link href="/" className="flex items-center gap-2">
            <Logo size={28} />
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-primary-text">Reviews</h1>
          <p className="text-[14px] text-secondary-text font-bold mt-1">What people are saying about rooms on RoomUndo.</p>
        </div>

        {(!reviews || reviews.length === 0) ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center mx-auto mb-4 shadow-sm">
              <MessageSquareText className="w-7 h-7" style={{ color: "#FF385C" }} />
            </div>
            <p className="text-[16px] font-extrabold text-primary-text mb-1">No reviews yet</p>
            <p className="text-[14px] font-bold text-secondary-text">Reviews will appear here once users submit them.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-5 rounded-2xl border-2 border-border-color/50 bg-surface shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-accent-light flex items-center justify-center text-[13px] font-extrabold shrink-0" style={{ color: "#FF385C" }}>
                        {review.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[14px] font-extrabold text-primary-text">{review.username}</p>
                        <p className="text-[12px] font-bold text-secondary-text">{review.rooms?.title || "Unknown room"}</p>
                      </div>
                    </div>
                    {review.rooms?.location_name && (
                      <div className="flex items-center gap-1 mt-1 ml-11">
                        <MapPin className="w-3 h-3" style={{ color: "#FF385C" }} />
                        <span className="text-[11px] font-bold text-secondary-text">{review.rooms.location_name}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className="w-3.5 h-3.5" style={{ color: i < review.rating ? "#FF9600" : "#DDD", fill: i < review.rating ? "#FF9600" : "transparent" }} />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-secondary-text mt-1 block">
                      {new Date(review.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
                <p className="text-[14px] text-primary-text leading-relaxed font-semibold">{review.comment}</p>
              </div>
            ))}
            <p className="text-center text-[12px] font-bold text-secondary-text pt-4 pb-8">
              Showing {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
