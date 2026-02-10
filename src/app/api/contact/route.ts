import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, address, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Send notification email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: 'Casa Intelligence <notifications@casaintelligence.com.au>',
        to: ['hello@casaintelligence.com.au'],
        reply_to: email,
        subject: `New Enquiry from ${name}${address ? ` | ${address}` : ''}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1B1464;">New Website Enquiry</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #525252; font-weight: 600;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #525252; font-weight: 600;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding: 8px 0; color: #525252; font-weight: 600;">Phone</td><td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td></tr>` : ''}
              ${address ? `<tr><td style="padding: 8px 0; color: #525252; font-weight: 600;">Property Address</td><td style="padding: 8px 0;">${address}</td></tr>` : ''}
            </table>
            <div style="margin-top: 16px; padding: 16px; background: #F5F5F4; border-radius: 8px;">
              <p style="color: #525252; font-weight: 600; margin: 0 0 8px;">Message</p>
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process enquiry. Please try again.' },
      { status: 500 }
    );
  }
}
