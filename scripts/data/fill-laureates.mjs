// Wpisuje laureatów z laureaci-2025.json do konkursu w CMS (po wdrożeniu pola „Laureaci”).
//   CMS_TOKEN=… node scripts/data/fill-laureates.mjs [https://nb.dexint.xyz]
import { readFileSync } from 'node:fs'

const base = process.argv[2] ?? 'https://nb.dexint.xyz'
const token = process.env.CMS_TOKEN
if (!token) throw new Error('Brak CMS_TOKEN')
const data = JSON.parse(readFileSync(new URL('./laureaci-2025.json', import.meta.url), 'utf8'))
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

const list = await (await fetch(`${base}/api/collections/contests?perPage=50`, { headers })).json()
const contest = list.records.find((c) => c.title.includes(data.contestTitleContains))
if (!contest) throw new Error('Nie znaleziono konkursu')
const res = await fetch(`${base}/api/collections/contests/${contest.id}`, {
  method: 'PATCH',
  headers,
  body: JSON.stringify({ laureatesTitle: data.laureatesTitle, laureates: data.laureates }),
})
console.log(res.status, contest.title, `${data.laureates.length} laureatów`)
