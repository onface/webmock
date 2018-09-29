const Webmock = require('../lib/index')
const express = require('express')
const app = express()
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cors = require('cors')
const mock = new Webmock()
app.use(cors())
    .use(cookieParser())
    .use(bodyParser.urlencoded({extended: false, limit: '10240000kb'}))
    .use(bodyParser.json())
app.use(mock.connect('express'))
module.exports = function createApp (cb) {
    cb(mock, app)
    return app
}
