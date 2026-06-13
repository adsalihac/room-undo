import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reviewId, reply } = await req.json();
  if (!reviewId || typeof reply !== "string") return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { error } = await supabase.from("reviews").update({ owner_reply: reply }).eq("id", reviewId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
