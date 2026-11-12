
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    // Check Supabase configuration first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase configuration is missing.");

      return Response.json(
        { error: "Server configuration is incomplete." },
        { status: 500 }
      );
    }

    // Read submitted form data
    const formData = await request.formData();

    const getText = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" ? value.trim() : "";
    };

    // Validate essential customer information
    const fullName = getText("full_name");
    const email = getText("email");

    if (!fullName || !email) {
      return Response.json(
        { error: "Please provide your name and email address." },
        { status: 400 }
      );
    }

    // Create Supabase server client
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Save inquiry to Supabase
    const { error: dbError } = await supabaseAdmin
      .from("project_inquiries")
      .insert({
        full_name: fullName,
        business_name: getText("business"),
        email,
        whatsapp: getText("phone"),
        location: getText("location"),
        service: getText("service"),
        project_description: getText("project_description"),
        budget: getText("budget"),
        timeline: getText("timeline"),
        additional_info: getText("additional_info"),
        consent:
          formData.get("consent") === "on" ||
          formData.get("consent") === "true",
        status: "new",
      });

    if (dbError) {
      console.error("Supabase inquiry error:", dbError);

      return Response.json(
        { error: "Unable to save your project inquiry. Please try again." },
        { status: 500 }
      );
    }

    // Inquiry saved successfully.
    // Email notifications are intentionally disabled for now.

    return Response.json(
      {
        success: true,
        message: "Your project inquiry has been submitted successfully.",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Project inquiry API error:", error);

    return Response.json(
      { error: "Unable to process your inquiry. Please try again." },
      { status: 500 }
    );
  }
}
