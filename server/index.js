const express = require('express')
const consola = require('consola')
const cors = require('./cors')
const api = require('./api/index')
const local = require('./local')
const bodyParser = require('body-parser')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const router = express.Router()
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('public'))
app.use(express.static('data'))
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }
  app.use(['/api', '/api1', '/api2', '/api3'], api)
  app.use(['/local'], local)
  app.use(nuxt.render)
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
