var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cors = require('cors')
var Webmock = require('./index')

module.exports = function (props) {
    var app = express()
    var mock = new Webmock(props)
    app.use(cors())
        .use(cookieParser())
        .use(bodyParser.urlencoded({extended: false, limit: '10240000kb'}))
        .use(bodyParser.json())
    if (props.static) {
        app.use(express.static(props.static))
    }
    else {
        console.log('Because props.static is undefined, so server will not view static.')
    }
    setTimeout(function() {
        app.use(mock.connect('express'))
    }, 0)
    var port = 1219
    if (props.port) {
        app.listen(props.port, function () {
            console.log('Webmock: http://127.0.0.1:' + props.port)
        })
    }
    else {
        console.log('Because props.port is undefined, so server will not listen port.')
    }
    return {
        app,
        mock
    }
}
