import { createClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("credits, has_ever_paid")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      // If profile doesn't exist, return defaults
      return Response.json({ credits: 0, hasEverPaid: false });
    }

    return Response.json({
      credits: profile.credits,
      hasEverPaid: profile.has_ever_paid,
    });
  } catch (error) {
    console.error("Credits fetch error:", error);
    return Response.json({ error: "Failed to fetch credits" }, { status: 500 });
  }
}
