
import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase_server";
import { createClient } from "@supabase/supabase-js";

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

// GET: Fetch all clients
export async function GET() {
  const result = await getAdminClient();

  if (result.error) return result.error;

  const { data, error } = await result.supabase!
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ clients: data });
}

// POST: Add a new client
export async function POST(request: Request) {
  const result = await getAdminClient();

  if (result.error) return result.error;

  try {
    const body = await request.json();

    const full_name = body.full_name?.trim();

    if (!full_name) {
      return NextResponse.json(
        { error: "Client name is required." },
        { status: 400 }
      );
    }

    const { data, error } = await result.supabase!
      .from("clients")
      .insert({
        full_name,
        business_name: body.business_name?.trim() || null,
        email: body.email?.trim() || null,
        whatsapp: body.whatsapp?.trim() || null,
        location: body.location?.trim() || null,
        notes: body.notes?.trim() || null,
        source_inquiry_id: body.source_inquiry_id || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ client: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request data." },
      { status: 400 }
    );
  }
}

// PATCH: Update a client
export async function PATCH(request: Request) {
  const result = await getAdminClient();

  if (result.error) return result.error;

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Client ID is required." },
        { status: 400 }
      );
    }

    const updates: Record<string, string | null> = {};

    const fields = [
      "full_name",
      "business_name",
      "email",
      "whatsapp",
      "location",
      "notes",
    ] as const;

    for (const field of fields) {
      if (field in body) {
        updates[field] =
          typeof body[field] === "string"
            ? body[field].trim() || null
            : null;
      }
    }

    if (
      "full_name" in updates &&
      !updates.full_name
    ) {
      return NextResponse.json(
        { error: "Client name cannot be empty." },
        { status: 400 }
      );
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No client details were provided to update." },
        { status: 400 }
      );
    }

    const { data, error } = await result.supabase!
      .from("clients")
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

    return NextResponse.json({ client: data });
  } catch {
    return NextResponse.json(
      { error: "Invalid request data." },
      { status: 400 }
    );
  }
}

// DELETE: Remove a client
export async function DELETE(request: Request) {
  const result = await getAdminClient();

  if (result.error) return result.error;

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Client ID is required." },
        { status: 400 }
      );
    }

    const { error } = await result.supabase!
      .from("clients")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Client deleted successfully.",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request data." },
      { status: 400 }
    );
  }
}
