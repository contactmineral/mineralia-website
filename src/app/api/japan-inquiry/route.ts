import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = "bhavishya@mineralia.org.in";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company, contactName, email, mineral, requirements } = body;

    if (!company || !contactName || !email || !requirements) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "Mineralia Website <noreply@mineralia.org.in>",
      to: [TO_EMAIL],
      replyTo: email,
      subject: `Japan Market Inquiry: ${mineral ?? "General"} — ${company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <div style="background: #111827; padding: 28px 32px; border-radius: 6px 6px 0 0;">
            <p style="color: #94a3b8; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 8px;">
              日本市場向け | Japan Industrial Market
            </p>
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: bold; letter-spacing: -0.5px;">
              New Japan Market Inquiry
            </h1>
            <p style="color: #94a3b8; margin: 6px 0 0; font-size: 14px;">Received via mineralia.org.in/minerals-for-japanese-industry</p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: none; padding: 32px; border-radius: 0 0 6px 6px;">

            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 160px; vertical-align: top;">Company</td>
                <td style="padding: 10px 0; color: #1e293b;">${company}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: 600; vertical-align: top;">Contact Name</td>
                <td style="padding: 10px 0; color: #1e293b;">${contactName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: 600; vertical-align: top;">Email</td>
                <td style="padding: 10px 0; color: #1e293b;"><a href="mailto:${email}" style="color: #C27840;">${email}</a></td>
              </tr>
              ${mineral ? `<tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: 600; vertical-align: top;">Target Mineral</td>
                <td style="padding: 10px 0; color: #1e293b;">${mineral}</td>
              </tr>` : ""}
            </table>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #C27840; padding: 16px 20px; border-radius: 4px;">
              <p style="margin: 0 0 8px; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Specification Requirements</p>
              <p style="margin: 0; color: #1e293b; line-height: 1.6; white-space: pre-line;">${requirements}</p>
            </div>

          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ message: "Failed to send inquiry." }, { status: 500 });
    }

    return NextResponse.json({ message: "Inquiry sent successfully." }, { status: 200 });
  } catch (err) {
    console.error("Japan inquiry API error:", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
