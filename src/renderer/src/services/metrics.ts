const METRICS_API_URL = 'http://localhost:3000'

async function postMetricEvent(path: string): Promise<void> {
  try {
    await fetch(`${METRICS_API_URL}${path}`, {
      method: 'POST'
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
