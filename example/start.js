var Webmock = require('../lib/index')
var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()

var mock = new Webmock()

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

mock.url('login', {
    title: '登录',
    type: 'get',
    req: {
        "user": {
            type: 'string',
            description: '邮箱或手机',
            exmaple: 'mail@qq.com'
        },
        "password": {
            type: 'string',
            description: '密码'
        }
    },
    data: {
        pass: {
            'balance|100-200': '',
        },
        $pass: {
            match: {
                query: {
                    user: {
                        pattern: 'admin'
                    },
                    password: {
                        pattern: '123456'
                    }
                },
                header: {/* json schema */},
                cookie: {/* json schema */}
            },
            schema: {
                balance: {
                    type: 'number',
                    minimum: 0
                }
            },
            timeout: 200
        },
        fail: {
            msg: '用户名错误'
        }
    }
})
mock.url('order', {
    title: '订单列表',
    type: 'get',
    req: {
        page: {
            type: 'number',
            description: '页码'
        },
        pageSize: {
            type: 'number',
            description: '每页显示多少条'
        }
    },
    data: {
        pass: {
            'list|10': [
                {
                    id: '@id',
                    type: '@pick(["unpaid", "paid"])',
                    name: '@ctitle(5,10)',
                    date: '@date("yyyy-MM-dd") @time("HH:mm:ss")'
                }
            ],
            pageCount: 20,
            dataTotal: 208
        },
        empty: {
            type: 'pass',
            list: [],
            page: 0
        }
    }
})
