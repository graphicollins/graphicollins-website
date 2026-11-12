
import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase_server";
import { createClient } from "@supabase/supabase-js";

const allowedStatuses = [
  "new",
  "researching",
  "awaiting_approval",
  "contacted",
  "interested",
  "negotiating",
  "converted",
  "not_interested",
  "unresponsive",
];

async function getAdminClient() {
  const authClient = await createServerClient();

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      ),
    };
  }

  if (
    user.email?.toLowerCase() !==
    process.env.ADMIN_EMAIL?.toLowerCase()
  ) {
    return {
      error: NextResponse.json(
        { error: "Administrator access required." },
        { status: 403 }
      ),
    };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  return { supabase };
}

// GET: Retrieve sales leads
export async function GET() {
  const result = await getAdminClient();

  if (result.error) return result.error;

  const { data, error } = await result.supabase!
    .from("sales_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ leads: data });
}

// POST: Create a sales lead
export async function POST(request: Request) {
  const result = await getAdminClient();

  if (result.error) return result.error;

  try {
    const body = await request.json();

    if (!body.full_name?.trim()) {
      return NextResponse.json(
        { error: "Prospect full name is required." },
        { status: 400 }
      );
    }

    const { data, error } = await result.supabase!
      .from("sales_leads")
      .insert({
        full_name: body.full_name.trim(),
        business_name: body.business_name?.trim() || null,
        email: body.email?.trim() || null,
        whatsapp: body.whatsapp?.trim() || null,
        website: body.website?.trim() || null,
        location: body.location?.trim() || null,
        industry: body.industry?.trim() || null,
        service_interest: body.service_interest?.trim() || null,
        lead_source: body.lead_source?.trim() || "manual",
        sales_notes: body.sales_notes?.trim() || null,
        status: "new",
        outreach_approved: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request data." },
      { status: 400 }
    );
  }
}

// PATCH: Update a sales lead
export async function PATCH(request: Request) {
  const result = await getAdminClient();

  if (result.error) return result.error;

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Lead ID is required." },
        { status: 400 }
      );
    }

    const updates: Record<string, string | boolean | null> = {};

    const textFields = [
      "full_name",
      "business_name",
      "email",
      "whatsapp",
      "website",
      "location",
      "industry",
      "service_interest",
      "lead_source",
      "sales_notes",
    ];

    for (const field of textFields) {
      if (field in body) {
        updates[field] =
          typeof body[field] === "string"
            ? body[field].trim() || null
            : null;
      }
    }

    if ("status" in body) {
      if (!allowedStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid lead status." },
          { status: 400 }
        );
      }

      updates.status = body.status;
    }

    if ("outreach_approved" in body) {
      updates.outreach_approved = Boolean(body.outreach_approved);
    }

    if ("next_follow_up_at" in body) {
      updates.next_follow_up_at = body.next_follow_up_at || null;
    }

    if ("last_contacted_at" in body) {
      updates.last_contacted_at = body.last_contacted_at || null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid lead details were provided." },
        { status: 400 }
      );
    }

    if (
      "full_name" in updates &&
      !updates.full_name
    ) {
      return NextResponse.json(
        { error: "Prospect name cannot be empty." },
        { status: 400 }
      );
    }

    const { data, error } = await result.supabase!
      .from("sales_leads")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead: data });
  } catch {
    return NextResponse.json(
      { error: "Invalid request data." },
      { status: 400 }
    );
  }
}

// DELETE: Remove a sales lead
export async function DELETE(request: Request) {
  const result = await getAdminClient();

  if (result.error) return result.error;

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Lead ID is required." },
        { status: 400 }
      );
    }

    const { error } = await result.supabase!
      .from("sales_leads")
      .delete()
      .eq("id", body.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Sales lead deleted successfully.",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request data." },
      { status: 400 }
    );
  }
}
