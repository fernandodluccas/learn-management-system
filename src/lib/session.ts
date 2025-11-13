import 'server-only'
import { cookies } from 'next/headers'
import { createHmac } from 'crypto'

type SessionPayload = {
    userId: string
    expiresAt: string
}

function base64Url(buffer: Buffer) {
    return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function encrypt(payload: { userId: string; expiresAt: Date }) {
    const secret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret'
    const data: SessionPayload = { userId: payload.userId, expiresAt: payload.expiresAt.toISOString() }
    const json = JSON.stringify(data)
    const dataBuf = Buffer.from(json, 'utf8')
    const signature = createHmac('sha256', secret).update(dataBuf).digest()
    return `${base64Url(dataBuf)}.${base64Url(signature)}`
}

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId, expiresAt })
    const cookieStore = await cookies()

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}