// GET /api/leads
// Returns all contact-form submissions, newest first, for the crm.html
// dashboard. Requires an "x-admin-key" header matching the ADMIN_KEY
// environment variable set in Vercel. See README.txt.

const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'DELETE') {
    res.setHeader('Allow', 'GET, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const providedKey = req.headers['x-admin-key'];
  if (!process.env.ADMIN_KEY || !providedKey || providedKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized. Check your admin key.' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'The site is not connected to a database yet.' });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    if (req.method === 'DELETE') {
      const id = parseInt((req.query && req.query.id) || '', 10);
      if (!id) return res.status(400).json({ error: 'Missing or invalid lead id.' });
      await sql`DELETE FROM leads WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    const rows = await sql`
      SELECT id, name, email, phone, project_type, message, created_at
      FROM leads
      ORDER BY created_at DESC
    `;
    return res.status(200).json({ leads: rows });
  } catch (err) {
    console.error('leads.js error:', err);
    return res.status(500).json({ error: 'Failed to load leads.' });
  }
};
