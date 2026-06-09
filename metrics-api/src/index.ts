import express from 'express'
import client from './metrics'
import { youtubeSearchCounter, connectedUsersGauge } from './metrics'
import { existsSync } from 'fs'
import { resolve } from 'path'
import dotenv from 'dotenv'

const envPaths = [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), '..', '.env'),
  resolve(__dirname, '../../.env')
]

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath })
    break
  }
}

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  next()
})

app.options(/.*/, (_req, res) => {
  res.sendStatus(204)
})

app.use(express.json())

app.post('/search', (req, res) => {
  if (req.header('Authorization') !== `Bearer ${process.env.API_KEY}`) {
    return res.sendStatus(401)
  }

  youtubeSearchCounter.inc()

  res.sendStatus(200)
})

app.post('/connect', (req, res) => {
  if (req.header('Authorization') !== `Bearer ${process.env.API_KEY}`) {
    return res.sendStatus(401)
  }

  connectedUsersGauge.inc()

  res.sendStatus(200)
})

app.post('/disconnect', (req, res) => {
  if (req.header('Authorization') !== `Bearer ${process.env.API_KEY}`) {
    return res.sendStatus(401)
  }

  connectedUsersGauge.dec()

  res.sendStatus(200)
})

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', client.register.contentType)
  res.end(await client.register.metrics())
})

app.listen(3000, () => {
  console.log('metrics api running on :3000')
})
