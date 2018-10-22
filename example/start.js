var Webmock = require('../lib/index')
const { mock , app } = Webmock.express({
    port: 1219,
    static: __dirname,
    url: {
        data: {
            pass: {},
            fail: {msg: 'fail message'}
        }
    },
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
