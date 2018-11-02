var Webmock = require('../lib/index')
var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cors = require('cors')

const { mock , app } = Webmock.express({
    port: 1219,
    static: __dirname,
    url: {
        data: {
            pass: {},
            fail: {msg: 'fail message'}
        }
    },
    dataAutoFill: [
        {
            key: 'status',
            replace: 'rType',
            replacerTypeMap: {
                'pass': 'success',
                'fail': 'error',
                '::default': 'success'
            }
        },
        {
            key: 'data',
            replace: 'root',
            replaceRootIgnore: ['msg']
        }
    ],
    renderRoot: __dirname
})
// mock.writeDoc(__dirname + '/doc.html')
mock.url('/news', {
    type: 'get',
    data: {
        pass: {
            'list|10': {
                title: '@ctitle'
            }
        },
        empty: {
            'list': []
        }
    }
})

mock.url('/login', {
    title: '登录',
    type: 'post',
    // JSON schema
    req: {
        user: {
            title: '用户名',
            example: 'nimo'
        },
        password: {
            title: '密码',
            example: 'abcddefg'
        }
    }
})
mock.url('/user', {
    type: 'post',
    view: 'user.html',
    // JSON schema
    req: {
        user: {
            title: '用户名',
            example: 'nimo'
        },
        password: {
            title: '密码',
            example: 'abcddefg'
        }
    },
    data: {
        pass: {
            name: 'nimo'
        }
    },
    engine: 'php'
})
