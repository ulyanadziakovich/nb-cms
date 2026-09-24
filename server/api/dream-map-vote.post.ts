import { query, rawQuery } from '#pruvious/server'

/**
 * Public "upvote a Dream Map postulate" endpoint. Deliberately NOT the
 * generic Pruvious public `update` API route (that would let anyone PATCH
 * any field — title, challenge, solution, position — on any record, not
 * just bump a counter). This does exactly one thing: atomically increments
 * `votes` for one record, identified by its stable `pointNumber`.
 *
 * One-vote-per-postulate-per-browser is enforced client-side only (see
 * useDreamMapPoints.ts) — this is a small community consultation site, not
 * a poll that needs to survive a determined attacker, so a light per-IP
 * rate limit is enough defense-in-depth against casual/scripted abuse.
 */

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 40
const hits = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string) {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (isRateLimited(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many votes — try again later' })
  }

  const body = await readBody(event)
  const pointNumber = Number(body?.pointNumber)
  if (!Number.isInteger(pointNumber) || pointNumber < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid pointNumber' })
  }

  const existing = await query('dream-map-points').where('pointNumber', pointNumber).select(['id']).first()
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Postulate not found' })
  }

  await rawQuery('UPDATE dream_map_points SET votes = COALESCE(votes, 0) + 1 WHERE point_number = :pointNumber', {
    pointNumber,
  })

  const updated = await query('dream-map-points').where('pointNumber', pointNumber).select(['votes']).first()

  return { pointNumber, votes: updated?.votes ?? 0 }
})
