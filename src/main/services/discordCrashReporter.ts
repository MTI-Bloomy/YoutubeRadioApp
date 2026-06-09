import { join } from 'path'
import dotenv from 'dotenv'

type CrashReportContext = {
  scope: string
  error: unknown
}

// Load environment files if present
dotenv.config({ path: join(process.cwd(), '.env') })

function normalizeError(error: unknown): { name: string; message: string; stack?: string } {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    }
  }

  return {
    name: 'Error',
    message: String(error)
  }
}

export async function sendDiscordCrashReport(context: CrashReportContext): Promise<void> {
  const webhookUrl = process.env.DISCORD_CRASH_WEBHOOK_URL?.trim()

  if (!webhookUrl) {
    return
  }

  const normalizedError = normalizeError(context.error)
  // dedupe same error signature for a short window to avoid duplicates
  const signature = `${context.scope}::${String(normalizedError.message ?? '')}`.slice(0, 400)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let set: Set<string> = (sendDiscordCrashReport as any)._recentSignatures
  if (!set) set = new Set<string>()
  if (set.has(signature)) return
  set.add(signature)
  setTimeout(() => set.delete(signature), 5000)

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'YoutubeRadioApp Crash Reporter',
        embeds: [
          {
            title: 'Crash report',
            color: 16724787,
            timestamp: new Date().toISOString(),
            fields: [
              {
                name: 'Scope',
                value: context.scope,
                inline: false
              },
              {
                name: 'Error',
                value: normalizedError.message.slice(0, 1024),
                inline: false
              },
              {
                name: 'Stack',
                value: (normalizedError.stack ?? 'No stack available').slice(0, 1024),
                inline: false
              }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      console.error(
        `Failed to send Discord crash report: ${response.status} ${response.statusText}`
      )
    }
  } catch (reportError) {
    console.error('Failed to send Discord crash report:', reportError)
  }
}
