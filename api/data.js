import { kv } from '@vercel/kv';

const KEY = 'cpc_tracker_data';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET — devolver dados
  if (req.method === 'GET') {
    try {
      const data = await kv.get(KEY);
      return res.status(200).json(data || { sections: [] });
    } catch (err) {
      console.error('[GET] KV error:', err);
      return res.status(500).json({ error: 'Erro ao ler dados', sections: [] });
    }
  }

  // POST — guardar dados
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (!body || !Array.isArray(body.sections)) {
        return res.status(400).json({ error: 'Formato inválido: esperado { sections: [] }' });
      }

      await kv.set(KEY, body);
      return res.status(200).json({ ok: true, savedAt: new Date().toISOString() });
    } catch (err) {
      console.error('[POST] KV error:', err);
      return res.status(500).json({ error: 'Erro ao guardar dados' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
