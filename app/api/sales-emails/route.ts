
import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase_server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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

// GET: Retrieve email outreach history
export async function GET() {
  const result = await getAdminClient();

  if (result.error) return result.error;

  const { data, error } = await result.supabase!
    .from("sales_email_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ emails: data });
}

// POST: Prepare a new sales email draft
export async function POST(request: Request) {
  const result = await getAdminClient();

  if (result.error) return result.error;

  try {
    const body = await request.json();

    const recipientEmail = body.recipient_email?.trim();
    const subject = body.subject?.trim();
    const emailBody = body.email_body?.trim();

    if (!recipientEmail || !subject || !emailBody) {
      return NextResponse.json(
        {
          error:
            "Recipient email, subject and message are required.",
        },
        { status: 400 }
      );
    }

    const { data: lead, error: leadError } =
      await result.supabase!
        .from("sales_leads")
        .select("id, email")
        .eq("id", body.lead_id)
        .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: "Sales lead not found." },
        { status: 404 }
      );
    }

    if (
      lead.email?.toLowerCase() !==
      recipientEmail.toLowerCase()
    ) {
      return NextResponse.json(
        {
          error:
            "Recipient must match the selected prospect's email address.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await result.supabase!
      .from("sales_email_logs")
      .insert({
        lead_id: lead.id,
        recipient_email: recipientEmail,
        subject,
        email_body: emailBody,
        status: "draft",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ email: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request data." },
      { status: 400 }
    );
  }
}

// PATCH: Approve a draft or send an approved email
export async function PATCH(request: Request) {
  const result = await getAdminClient();

  if (result.error) return result.error;

  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || !["approve", "send"].includes(action)) {
      return NextResponse.json(
        { error: "A valid email ID and action are required." },
        { status: 400 }
      );
    }

    const { data: email, error: emailError } =
      await result.supabase!
        .from("sales_email_logs")
        .select("*")
        .eq("id", id)
        .single();

    if (emailError || !email) {
      return NextResponse.json(
        { error: "Email record not found." },
        { status: 404 }
      );
    }

    if (action === "approve") {
      if (email.status !== "draft") {
        return NextResponse.json(
          { error: "Only draft emails can be approved." },
          { status: 400 }
        );
      }

      const { data, error } = await result.supabase!
        .from("sales_email_logs")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("status", "draft")
        .select()
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: error?.message || "Approval failed." },
          { status: 409 }
        );
      }

      return NextResponse.json({
        email: data,
        message: "Email approved successfully.",
      });
    }

    if (email.status !== "approved") {
      return NextResponse.json(
        { error: "Approve this email before sending." },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Resend API key is not configured." },
        { status: 500 }
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!fromEmail) {
      return NextResponse.json(
        { error: "RESEND_FROM_EMAIL is not configured." },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data: sentData, error: sendError } =
      await resend.emails.send({
        from: fromEmail,
        to: [email.recipient_email],
        subject: email.subject,
        text: email.email_body,
      });

    if (sendError) {
      await result.supabase!
        .from("sales_email_logs")
        .update({
          status: "failed",
          error_message: sendError.message,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("status", "approved");

      return NextResponse.json(
        { error: sendError.message },
        { status: 502 }
      );
    }

    const { data, error } = await result.supabase!
      .from("sales_email_logs")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        error_message: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("status", "approved")
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          error:
            "The email was sent, but its database status could not be updated. Check your Resend dashboard before retrying.",
          resend_id: sentData?.id,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      email: data,
      message: "Sales email sent successfully.",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request data." },
      { status: 400 }
    );
  }
}
