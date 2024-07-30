import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  const originalUrl = await kv.get(id);

  if (!originalUrl) {
    return res.status(404).json({ error: 'URL not found' });
  }

  res.redirect(301, originalUrl);
}