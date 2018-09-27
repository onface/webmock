var Webmock = require('../lib/index')
var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()

var mock = new Webmock({
    renderViewRoot: __dirname
})

app.use(cors())
    .use(cookieParser())
    .use(bodyParser.urlencoded({extended: false, limit: '10240000kb'}))
    .use(bodyParser.json())
app.use(express.static(require('path').join(__dirname,'./'))) // 配置静态资源路径
app.use(mock.server('express'))

var port = 1219
app.listen(port, function () {
    console.log('Webmock: http://127.0.0.1:' + port)
})
mock.writeDoc(__dirname + '/doc.html')
mock.render('/demo', {
    view: 'index.html',
    data: {
        pass: {
            email: '@email'
        },
        fail: {
            msg: '@email is spam'
        }
    }
})

mock.render('/php', {
    view: 'php.php',
    engine: 'php',
    data: {
        pass: {
            age: 24
        }
    }
})
