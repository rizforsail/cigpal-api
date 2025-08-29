// pages/api/places.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { q, lat, lng, radius } = req.query
  const key = process.env.GOOGLE_MAPS_API_KEY
  if (!key) return res.status(500).json({ error: 'Missing GOOGLE_MAPS_API_KEY' })

  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json')
  url.searchParams.set('query', (q as string) || 'cigar lounge near me')
  if (lat && lng) url.searchParams.set('location', `${lat},${lng}`)
  url.searchParams.set('radius', (radius as string) || '20000')
  url.searchParams.set('key', key)

  const r = await fetch(url.toString())
  const data = await r.json()
  return res.status(200).json(data)
}
