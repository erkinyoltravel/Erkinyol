import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error: 'Method not allowed' });

  const { name, email, phone, nationality, dates, pax, transport = [], guideLanguages = [], message = '', lang = 'ru', source = 'landing' } = req.body || {};

  try {
    if (process.env.WEBHOOK_URL) {
      await fetch(process.env.WEBHOOK_URL, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ name, email, phone, nationality, dates, pax, transport, guideLanguages, message, lang, source, ts: new Date().toISOString() })
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const html = `
      <h2>ErkinYol Travel – New Request</h2>
      <p><b>Name:</b> ${name||''}</p>
      <p><b>Email:</b> ${email||''}</p>
      <p><b>Phone:</b> ${phone||''}</p>
      <p><b>Citizenship:</b> ${nationality||''}</p>
      <p><b>Dates:</b> ${dates||''}</p>
      <p><b>Pax:</b> ${pax||''}</p>
      <p><b>Transport:</b> ${(transport||[]).join(', ')}</p>
      <p><b>Guide languages:</b> ${(guideLanguages||[]).join(', ')}</p>
      <p><b>Lang:</b> ${lang}</p>
      <p><b>Message:</b><br/>${(message||'').replace(/\n/g,'<br/>')}</p>
    `;

    await transporter.sendMail({
      from: process.env.CONTACT_FROM,
      to: process.env.CONTACT_TO,
      subject: `ErkinYol – New request (${lang})`,
      html,
    });

    return res.status(200).json({ ok:true });
  } catch (e:any) {
    console.error(e);
    return res.status(500).json({ ok:false, error: e.message });
  }
}
