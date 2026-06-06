export const config = {
  path: '/api/rsvp',
  method: 'POST',
}

async function getAccessToken(email, privateKey) {
  const now = Math.floor(Date.now() / 1000)

  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64url(
    JSON.stringify({
      iss: email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    }),
  )

  // Strip PEM envelope and decode
  const pem = privateKey.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, '')
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0))

  const key = await crypto.subtle.importKey(
    'pkcs8',
    der,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const signingInput = `${header}.${payload}`
  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(signingInput),
  )

  const jwt = `${signingInput}.${base64url(sig)}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  })

  const data = await res.json()
  if (!data.access_token) throw new Error(`Token exchange failed: ${JSON.stringify(data)}`)
  return data.access_token
}

function base64url(input) {
  let str
  if (input instanceof ArrayBuffer) {
    str = btoa(String.fromCharCode(...new Uint8Array(input)))
  } else {
    str = btoa(unescape(encodeURIComponent(input)))
  }
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export default async (req) => {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
  const sheetId = process.env.GOOGLE_SHEET_ID

  if (!serviceAccountEmail || !privateKey || !sheetId) {
    return Response.json(
      { error: 'Missing Google Sheets configuration. Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID.' },
      { status: 500 },
    )
  }

  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { name, attending, guests = [], bus, diet, song, message } = body

  if (!name) {
    return Response.json({ error: 'name is required' }, { status: 400 })
  }

  // Normalise the private key — Netlify env vars sometimes have literal \n
  const normalizedKey = privateKey.replace(/\\n/g, '\n')

  let token
  try {
    token = await getAccessToken(serviceAccountEmail, normalizedKey)
  } catch (err) {
    console.error('Google auth error:', err)
    return Response.json({ error: 'Google authentication failed' }, { status: 500 })
  }

  const timestamp = new Date().toISOString()
  const row = [
    timestamp,
    name,
    attending ? 'Yes' : 'No',
    guests.filter(Boolean).join(', '),
    attending === true ? (bus === true ? 'Yes' : bus === false ? 'No' : '') : 'N/A',
    diet || '',
    song || '',
    message || '',
  ]

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [row] }),
    },
  )

  if (!appendRes.ok) {
    const errText = await appendRes.text()
    console.error('Sheets append error:', errText)
    return Response.json({ error: 'Failed to write to spreadsheet' }, { status: 500 })
  }

  return Response.json({ ok: true })
}
