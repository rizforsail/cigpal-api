// pages/api/concierge.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' })
  const { prompt } = req.body || {}
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Missing OPENAI_API_KEY' })

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are CIGPAL, a friendly cigar concierge.' },
        { role: 'user', content: String(prompt) }
      ],
      temperature: 0.7
    }),
  })
  const data = await r.json()
  const reply = data?.choices?.[0]?.message?.content || '…'
  return res.status(200).json({ reply })
}
