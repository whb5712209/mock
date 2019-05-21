const express = require('express')
const ec = require('./ec')
const upload = require('./upload')
const api = express() // the sub app
api.use([ '/ec' ], ec)
api.use([ '/upload' ], upload)
module.exports = api
