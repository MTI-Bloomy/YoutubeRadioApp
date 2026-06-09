async function postMetricEvent(path: string): Promise<void> {
  const apiUrl = process.env.API_URL?.trim()
  const apiKey = process.env.API_KEY?.trim()

  if (!apiUrl || !apiKey) {
    console.warn('Metrics service disabled: missing API_URL or API_KEY')
    return
  }

  try {
    await fetch(`${apiUrl}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })
  } catch (error) {
    console.error(`Failed to send metrics event to ${path}:`, error)
  }
}

export const metricsService = {
  search: async () => {
    await postMetricEvent(`/search`)
  },
  connect: async () => {
    await postMetricEvent('/connect')
  },
  disconnect: async () => {
    await postMetricEvent('/disconnect')
  }
}
