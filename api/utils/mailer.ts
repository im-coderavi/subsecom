import nodemailer from 'nodemailer';

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

interface MailItem { name: string; price: number; quantity: number; }

export async function sendPaymentConfirmation(opts: {
  customerName: string;
  customerEmail: string;
  orderId: string;
  items: MailItem[];
  total: number;
  utrNumber?: string;
  paidAt: Date;
}) {
  const { customerName, customerEmail, orderId, items, total, utrNumber, paidAt } = opts;
  const from = process.env.SMTP_FROM || `"AI Nest" <${process.env.SMTP_USER}>`;
  const shortId = orderId.slice(-8).toUpperCase();

  const itemRows = items.map((item) => `
    <tr>
      <td style="padding:11px 16px;font-size:13px;color:#374151;border-bottom:1px solid #f3f4f6;">${item.name}</td>
      <td style="padding:11px 16px;font-size:13px;color:#6b7280;border-bottom:1px solid #f3f4f6;text-align:center;">${item.quantity}</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:700;color:#7c3aed;border-bottom:1px solid #f3f4f6;text-align:right;">&#8377;${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Payment Confirmed</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:40px auto 60px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.10);">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%);padding:44px 44px 36px;">
    <div style="margin-bottom:28px;">
      <span style="display:inline-block;background:rgba(255,255,255,0.18);border-radius:12px;padding:8px 16px;color:#fff;font-size:18px;font-weight:900;letter-spacing:-0.5px;">AI Nest</span>
    </div>
    <h1 style="margin:0 0 8px;color:#fff;font-size:28px;font-weight:900;letter-spacing:-0.5px;">Payment Confirmed! &#x2705;</h1>
    <p style="margin:0;color:rgba(255,255,255,0.82);font-size:14px;line-height:1.5;">Your subscription is now active and ready to use.</p>
  </div>

  <!-- Body -->
  <div style="padding:44px;">

    <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.7;">
      Hi <strong style="color:#111827;">${customerName}</strong>,<br>
      Great news! We have successfully verified your UPI payment. Your AI Nest subscription is now <strong style="color:#059669;">active</strong>. Here is your official payment receipt:
    </p>

    <!-- Receipt -->
    <div style="background:#faf5ff;border:1.5px solid #e9d5ff;border-radius:14px;padding:24px;margin-bottom:32px;">
      <p style="margin:0 0 16px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:#7c3aed;">Payment Receipt</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:5px 0;font-size:13px;color:#6b7280;font-weight:600;">Order ID</td><td style="padding:5px 0;font-size:13px;color:#111827;font-weight:700;text-align:right;font-family:monospace;">#${shortId}</td></tr>
        <tr><td style="padding:5px 0;font-size:13px;color:#6b7280;font-weight:600;">Date &amp; Time</td><td style="padding:5px 0;font-size:13px;color:#111827;font-weight:700;text-align:right;">${paidAt.toLocaleString('en-IN', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}</td></tr>
        <tr><td style="padding:5px 0;font-size:13px;color:#6b7280;font-weight:600;">Customer Email</td><td style="padding:5px 0;font-size:13px;color:#111827;font-weight:700;text-align:right;">${customerEmail}</td></tr>
        <tr><td style="padding:5px 0;font-size:13px;color:#6b7280;font-weight:600;">Payment Mode</td><td style="padding:5px 0;font-size:13px;color:#111827;font-weight:700;text-align:right;">UPI</td></tr>
        ${utrNumber ? `<tr><td style="padding:5px 0;font-size:13px;color:#6b7280;font-weight:600;">UTR / Reference No.</td><td style="padding:5px 0;font-size:13px;color:#111827;font-weight:700;text-align:right;font-family:monospace;">${utrNumber}</td></tr>` : ''}
        <tr><td style="padding:9px 0 5px;font-size:15px;color:#5b21b6;font-weight:800;border-top:1.5px solid #e9d5ff;">Amount Paid</td><td style="padding:9px 0 5px;font-size:17px;color:#7c3aed;font-weight:900;text-align:right;border-top:1.5px solid #e9d5ff;">&#8377;${total.toLocaleString('en-IN')}</td></tr>
      </table>
    </div>

    <!-- Items -->
    <p style="margin:0 0 12px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:#374151;">Order Summary</p>
    <table style="width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;margin-bottom:32px;border:1px solid #f3f4f6;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:10px 16px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#9ca3af;text-align:left;">Product</th>
          <th style="padding:10px 16px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#9ca3af;text-align:center;">Qty</th>
          <th style="padding:10px 16px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#9ca3af;text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
      <tfoot>
        <tr style="background:#ede9fe;">
          <td colspan="2" style="padding:13px 16px;font-size:14px;font-weight:800;color:#5b21b6;">Total Paid</td>
          <td style="padding:13px 16px;font-size:17px;font-weight:900;color:#7c3aed;text-align:right;">&#8377;${total.toLocaleString('en-IN')}</td>
        </tr>
      </tfoot>
    </table>

    <!-- Next steps -->
    <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:14px;padding:22px;margin-bottom:32px;">
      <p style="margin:0 0 10px;font-size:13px;font-weight:800;color:#166534;">&#x1F680; What happens next?</p>
      <p style="margin:0;font-size:13px;color:#15803d;line-height:1.7;">Our team will send your account credentials via WhatsApp or a follow-up email within <strong>2–5 minutes</strong>. If you don't receive them within 10 minutes, please reply to this email or contact support.</p>
    </div>

    <!-- Support -->
    <div style="text-align:center;padding-top:20px;border-top:1px solid #f3f4f6;">
      <p style="margin:0 0 6px;font-size:13px;color:#6b7280;">Need help? We're here 24/7.</p>
      <p style="margin:0;font-size:12px;color:#9ca3af;">Reply to this email for instant support from our team.</p>
    </div>
  </div>

  <!-- Footer -->
  <div style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:24px 44px;text-align:center;">
    <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;font-weight:600;">AI Nest &mdash; Premium AI Tools Marketplace</p>
    <p style="margin:0;font-size:11px;color:#d1d5db;">This is an automated payment confirmation. Please keep this email for your records.</p>
  </div>

</div>
</body>
</html>`;

  await getTransporter().sendMail({
    from,
    to: customerEmail,
    subject: `✅ Payment Confirmed — AI Nest Order #${shortId}`,
    html,
  });
}
