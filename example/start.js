var Webmock = require('../lib/index')
var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()

app.use(cors())
    .use(cookieParser())
    .use(bodyParser.urlencoded({extended: false, limit: '10240000kb'}))
    .use(bodyParser.json())
app.use(express.static(__dirname)) // 配置静态资源路径

var mock = new Webmock({
    renderViewRoot: __dirname // 配置模板路径
})
app.use(mock.server('express'))
var port = 1219
app.listen(port, function () {
    console.log('Webmock: http://127.0.0.1:' + port)
})
mock.writeDoc(__dirname + '/doc.html')
mock.url('/demo', {
    type: 'get',
    title: '测试',
    req: {
        user: {
            title: '用户名',
            example: 'nimo'
        }
    },
    data: {
        pass: {
            email: '@email',
            'list': [{
                name: '@name'
            }]
        },
        $pass: {
            check: {
                email: {
                    title: '邮箱地址'
                }
            }
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

mock.url('/aa', {
    type: 'get'
})
