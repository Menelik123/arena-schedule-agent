import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendScheduleEmail(
  pdfBuffer: Buffer,
  date: string,
  scheduleUrl: string
): Promise<void> {
  const displayDate = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  await resend.emails.send({
    from: "The Arena Schedule <schedule@yourdomain.com>",
    to: [process.env.RECIPIENT_EMAIL!],
    subject: `Daily Schedule — ${displayDate}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #0d0d0d; padding: 24px 32px; border-radius: 4px 4px 0 0;">
          <p style="color: #ffffff; font-size: 18px; font-weight: 700; margin: 0;">The Arena Lilburn</p>
          <p style="color: #888; font-size: 13px; margin: 4px 0 0;">Daily Schedule — ${displayDate}</p>
        </div>
        <div style="background: #f9f9f7; padding: 28px 32px; border-radius: 0 0 4px 4px; border: 1px solid #ebebeb; border-top: none;">
          <p style="font-size: 14px; color: #444; line-height: 1.6; margin-top: 0;">
            Your schedule for today is attached. Print it out and you're good to go.
          </p>
          <a href="${scheduleUrl}"
            style="display: inline-block; background: #0d0d0d; color: #ffffff; text-decoration: none;
                   padding: 12px 24px; border-radius: 4px; font-size: 13px; font-weight: 600; margin-top: 4px;">
            View on Phone →
          </a>
          <p style="font-size: 11px; color: #aaa; margin-top: 28px; margin-bottom: 0;">
            Sent automatically by Apex Digital · The Arena Lilburn
          </p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `arena-schedule-${date}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}
