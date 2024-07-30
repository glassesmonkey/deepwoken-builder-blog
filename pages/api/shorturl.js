import { kv } from '@vercel/kv';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const id = crypto.createHash('md5').update(url).digest('hex').substring(0, 6);

  await kv.set(id, url);

  const shortUrl = `${process.env.VERCEL_URL}/api/redirect?id=${id}`;

  res.status(200).json({ shortUrl });
}