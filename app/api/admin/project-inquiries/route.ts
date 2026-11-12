
import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase_server";
import { createClient } from "@supabase/supabase-js";

const allowedStatuses = [
  "new",
  "in_progress",
  "completed",
  "cancelled",
];

async function getAdminClient() {
  const authClient = await createServerClient();

  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      ),
    };
  }

  const adminEmail = process.env.ADMIN_EMAIL;

  if (
    !adminEmail ||
    user.email?.toLowerCase() !== adminEmail.toLowerCase()
  ) {
    return {
      error: NextResponse.json(
        { error: "Administrator access required." },
        { status: 403 }
      ),
    };
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  return { supabaseAdmin };
}

// GET: Retrieve customer inquiries
export async function GET() {
  try {
    const { supabaseAdmin, error } = await getAdminClient();

    if (error) return error;

    const { data, error: dbError } = await supabaseAdmin!
      .from("project_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (dbError) {
      console.error(dbError);

      return NextResponse.json(
        { error: "Unable to retrieve inquiries." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiries: data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// PATCH: Update inquiry status
export async function PATCH(request: Request) {
  try {
    const { supabaseAdmin, error } = await getAdminClient();

    if (error) return error;

    const { id, status } = await request.json();

    if (
      typeof id !== "string" ||
      !id ||
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        { error: "A valid inquiry ID and status are required." },
        { status: 400 }
      );
    }

    const { data, error: dbError } = await supabaseAdmin!
      .from("project_inquiries")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (dbError) {
      console.error(dbError);

      return NextResponse.json(
        { error: "Unable to update inquiry status." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry status updated successfully.",
      inquiry: data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a customer inquiry
export async function DELETE(request: Request) {
  try {
    const { supabaseAdmin, error } = await getAdminClient();

    if (error) return error;

    const { id } = await request.json();

    if (typeof id !== "string" || !id) {
      return NextResponse.json(
        { error: "A valid inquiry ID is required." },
        { status: 400 }
      );
    }

    const { data, error: dbError } = await supabaseAdmin!
      .from("project_inquiries")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (dbError) {
      console.error(dbError);

      return NextResponse.json(
        { error: "Unable to delete inquiry." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Inquiry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
