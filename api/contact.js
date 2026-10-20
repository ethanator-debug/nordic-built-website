// POST /api/contact
// Saves a contact-form submission from contact.html into Neon Postgres.
// Requires the DATABASE_URL environment variable (Neon connection string)
// to be set in your Vercel project settings. See README.txt.

const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set.');
    return res.status(500).json({ error: 'The site is not connected to a database yet. Please call or email us directly.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const name = (body.name || '').toString().trim();
    const email = (body.email || '').toString().trim();
    const phone = (body.phone || '').toString().trim();
    const project = (body.project || '').toString().trim();
    const message = (body.message || '').toString().trim();

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    // very light email sanity check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const sql = neon(process.env.DATABASE_URL);
    await sql`
      INSERT INTO leads (name, email, phone, project_type, message)
      VALUES (${name}, ${email}, ${phone || null}, ${project || null}, ${message})
    `;

    // Email notification (optional). Never blocks or fails the submission.
    if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
      try {
        const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const when = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.NOTIFY_FROM || 'Nordic Built Website <onboarding@resend.dev>',
            to: process.env.NOTIFY_EMAIL.split(',').map((e) => e.trim()).filter(Boolean),
            reply_to: email,
            subject: 'New website inquiry from ' + name + (project ? ' — ' + project : ''),
            html:
              '<h2>New website inquiry</h2>' +
              '<p><strong>Name:</strong> ' + esc(name) + '</p>' +
              '<p><strong>Email:</strong> ' + esc(email) + '</p>' +
              '<p><strong>Phone:</strong> ' + esc(phone || 'Not provided') + '</p>' +
              '<p><strong>Project type:</strong> ' + esc(project || 'Not provided') + '</p>' +
              '<p><strong>Message:</strong><br>' + esc(message).replace(/\n/g, '<br>') + '</p>' +
              '<p style="color:#888">Received ' + esc(when) + ' (Central). Hit Reply to respond to the customer.</p>'
          })
        });
        if (!r.ok) console.error('Resend error:', r.status, await r.text());
      } catch (mailErr) {
        console.error('Email notification failed:', mailErr);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('contact.js error:', err);
    return res.status(500).json({ error: 'Something went wrong on our end. Please try again or call us directly.' });
  }
};
