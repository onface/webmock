var Webmock = require('../lib/index')
var express = require('express')
var app = express()
var port = 1219
app.listen(port, function () {
    console.log('Webmock: http://127.0.0.1:' + port)
})

var mock = new Webmock({
    defaultSettions: {
        url: {
            data: {
                $pass: {
                    type: 'pass'
                },
                $fail: {
                    type: 'fail',
                    msg: 'Fail message'
                }
            }
        },
        render: {
            data: {},
            engine: 'ejs'
        }
    },
    renderTemplateRoot: require('path').join(__dirname),
    renderEngine: {
        'php': {
            server: 'http://127.0.0.1:3000'
        },
        'xtpl': {
            compile: function (filePath, data, cb) {
                var xtpl = require('xtpl')
                xtpl.renderFile(filePath, data, function(error,content){
                    cb(error, content)
                })
            }
        }
    }
})
app.use('/inbox', function (req, res, next) {
    if (req.query._ === 'mock') {
        res.send({
            data: db.get('inbox').value()
        })
    }
    else {
        next()
    }
})
app.use(express.static(require('path').join(__dirname,'./'))) // 配置静态资源路径

app.use(mock.createExpress())

mock.render('login', {
    type: 'get',
    view: 'view/login/index.html'
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
