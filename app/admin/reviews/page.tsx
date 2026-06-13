import { createClient } from "@/utils/supabase/server";
import { Star, MessageSquareText } from "lucide-react";
import { redirect } from "next/navigation";
import DeleteReviewButton from "./delete-review";
import ReplyToReview from "./reply-to-review";

async function deleteReview(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("reviews").delete().eq("id", id);
  redirect("/admin/reviews");
}

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*, rooms(title)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
  }

  return (
    <div className="max-w-6xl mx-auto pb-16">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-primary-text">Reviews</h1>
        <p className="text-[14px] text-secondary-text font-bold mt-0.5">Manage user reviews for property listings.</p>
      </div>

      <div className="bg-surface rounded-2xl border-2 border-border-color/50 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-border-color/50" style={{ backgroundColor: "#F7F7F7" }}>
                <th className="py-4 px-5 font-extrabold text-[12px] text-secondary-text uppercase tracking-wider">Room</th>
                <th className="py-4 px-5 font-extrabold text-[12px] text-secondary-text uppercase tracking-wider">Reviewer</th>
                <th className="py-4 px-5 font-extrabold text-[12px] text-secondary-text uppercase tracking-wider">Rating</th>
                <th className="py-4 px-5 font-extrabold text-[12px] text-secondary-text uppercase tracking-wider">Comment</th>
                <th className="py-4 px-5 font-extrabold text-[12px] text-secondary-text uppercase tracking-wider">Reply</th>
                <th className="py-4 px-5 font-extrabold text-[12px] text-secondary-text uppercase tracking-wider">Date</th>
                <th className="py-4 px-5 font-extrabold text-[12px] text-secondary-text uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!reviews || reviews.length === 0) ? (
                <tr>
                  <td colSpan={7} className="py-16 px-5 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <MessageSquareText className="w-6 h-6" style={{ color: "#FF385C" }} />
                    </div>
                    <p className="text-[15px] font-extrabold text-primary-text mb-1">No reviews yet</p>
                    <p className="text-[14px] font-bold text-secondary-text">Reviews will appear here once users submit them.</p>
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="border-b border-border-color/30 hover:bg-accent-light/20 transition-colors">
                    <td className="py-4 px-5 align-middle">
                      <p className="text-[14px] font-extrabold text-primary-text">{review.rooms?.title || "Unknown"}</p>
                    </td>
                    <td className="py-4 px-5 align-middle">
                      <p className="text-[14px] font-bold text-primary-text">{review.username}</p>
                    </td>
                    <td className="py-4 px-5 align-middle">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className="w-3.5 h-3.5" style={{ color: i < review.rating ? "#FF9600" : "#DDD", fill: i < review.rating ? "#FF9600" : "transparent" }} />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-5 align-middle max-w-xs">
                      <p className="text-[13px] font-semibold text-secondary-text truncate">{review.comment}</p>
                    </td>
                    <td className="py-4 px-5 align-middle">
                      <ReplyToReview reviewId={review.id} currentReply={review.owner_reply || ""} />
                    </td>
                    <td className="py-4 px-5 align-middle">
                      <span className="text-[12px] font-bold text-secondary-text whitespace-nowrap">
                        {new Date(review.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </td>
                    <td className="py-4 px-5 align-middle text-right">
                      <DeleteReviewButton id={review.id} deleteAction={deleteReview} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
