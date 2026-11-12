import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const formData = await request.formData(); 

  const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  return Response.json(
    { error: "Supabase configuration is missing." },
    { status: 500 }
  );
}
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Email API key is missing." },
        { status: 500 }
      );
    }

    const escapeHtml = (value: string) =>
      value.replace(/[&<>"']/g, (char) => {
        const entities: Record<string, string> = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        };
        return entities[char];
      });

    const fields = Array.from(formData.entries())
      .map(([key, value]) => {
        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/[_-]/g, " ")
          .replace(/^./, (s) => s.toUpperCase());

        const content =
          typeof value === "string"
            ? value
            : value.name;

        return `
          <p>
            <strong>${escapeHtml(label)}:</strong><br/>
            ${escapeHtml(content)}
          </p>
        `;
      })
      .join("");

    
  const { error: dbError } = await supabaseAdmin
  .from("project_inquiries")
.insert({
full_name: formData.get("full_name")?.toString() || "",
business_name: formData.get("business")?.toString() || "",
email: formData.get("email")?.toString() || "",
whatsapp: formData.get("phone")?.toString() || "",
  location: formData.get("location")?.toString() || "",
  service: formData.get("service")?.toString() || "",
  project_description:
    formData.get("project_description")?.toString() || "",
  budget: formData.get("budget")?.toString() || "",
  timeline: formData.get("timeline")?.toString() || "",
  additional_info:
    formData.get("additional_info")?.toString() || "",
  consent: formData.get("consent") === "on",
  status: "new",
});


if (dbError) {
  console.error("Supabase insert error:", dbError);
  return Response.json(
    { error: "Unable to save your project inquiry." },
    { status: 500 }
  );
}

      const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "GRAPHICOLLINS <onboarding@resend.dev>",
          to: ["graphiccollins@gmail.com"],
          subject: "New Project Inquiry - GRAPHICOLLINS",
          html: `
            <h2>New Project Inquiry</h2>
            <p>A customer has submitted a project inquiry.</p>
            ${fields}
          `,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: result.message || "Email delivery failed." },
        { status: response.status }
      );
    }

    return Response.json({
      success: true,
      message: "Your project inquiry has been submitted successfully.",
    });

  } catch (error) {
    console.error("Inquiry API error:", error);

    return Response.json(
      { error: "Unable to process your inquiry." },
      { status: 500 }
    );
  }
}
