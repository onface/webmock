var request = require('supertest')
var createApp = require('./createApp')
var should = require('chai').should()
var mock
const app = createApp(function (webmock) {
    mock = webmock
})

describe('ajax.test.js', function() {

        mock.url('/login', {
            type: 'post',
            data: {
                pass: {
                    'balance|100-200': 1,
                }
            }
        })
        mock.url('/login', {
            type: 'put'
        })

    it('should return pass', function(done) {
        request(app)
        .post('/login')
        .expect(200)
        .then(res => {
            Object.keys(res.body).should.eql(['type', 'balance'])
            res.body.type.should.equal('pass')
            res.body.balance.should.above(99)
            res.body.balance.should.below(201)
            done()
        })
    })
    it('should return fail POST(_=fail)', function(done) {
        request(app)
        .post('/login')
        .send('_=fail')
        .expect(200)
        .then(res => {
            Object.keys(res.body).should.eql(['type', 'msg'])
            res.body.type.should.equal('fail')
            done()
        })
    })
    it('should return fail PUT(_=fail)', function(done) {
        request(app)
        .put('/login')
        .send('_=fail')
        .expect(200)
        .then(res => {
            Object.keys(res.body).should.eql(['type', 'msg'])
            res.body.type.should.equal('fail')
            done()
        })
    })
        mock.url('/news', {
            type: 'get',
            data: {
                pass: {
                    list: [
                        '瑞典电视台回应称“表达整体意思出现缺失”并未道歉',
                        '这个商品进了贸易战清单 俄罗斯愿助中国一臂之力',
                        '中国对外贸易实现历史性跨越 40年进口增长664倍'
                    ]
                },
                empty:{
                    list: []
                },
                $empty: {
                    matchReq: {
                        search: {
                            pattern: 'abc'
                        }
                    }
                },
                hot: {
                    list: [
                        'HOT 台风中中国机长倒飞直升机救人，大片都不敢这么拍！',
                        'HOT 注意！近期你家电视信号将出现干扰，原因是…',
                        'HOT 幼儿园装修孩子流鼻血 园方家长2次检测结果却相反'
                    ]
                },
                $hot: {
                    matchReq: {
                        schema: {
                            dependencies: {
                                'type': ['filter']
                            }
                        },
                        filter: {
                            enum: ['true']
                        },
                        type: {
                            enum: ['hot']
                        }
                    }
                }
            }
        })
    it('should return pass list', function(done) {
        request(app)
        .get('/news')
        .expect(200)
        .then(res => {
            Object.keys(res.body).should.eql(['type', 'list'])
            res.body.type.should.equal('pass')
            res.body.list.length.should.equal(3)
            done()
        })
    })
    it('should return empty GET(search=abc)', function(done) {
        request(app)
        .get('/news?search=abc')
        .expect(200)
        .then(res => {
            Object.keys(res.body).should.eql(['type', 'list'])
            res.body.type.should.equal('empty')
            res.body.list.length.should.equal(0)
            done()
        })
    })
    it('should return hot GET(filter=true&type=hot)', function(done) {
        request(app)
        .get('/news?filter=true&type=hot')
        .expect(200)
        .then(res => {
            Object.keys(res.body).should.eql(['type', 'list'])
            res.body.type.should.equal('hot')
            res.body.list.length.should.equal(3)
            res.body.list[0].should.eql('HOT 台风中中国机长倒飞直升机救人，大片都不敢这么拍！')
            done()
        })
    })
    it('should return hot GET(filter=true)', function(done) {
        request(app)
        .get('/news?filter=true')
        .expect(200)
        .then(res => {
            Object.keys(res.body).should.eql(['type', 'list'])
            res.body.type.should.equal('pass')
            res.body.list.length.should.equal(3)
            done()
        })
    })
        mock.url('/status404', {
            type: 'get',
            status: 404
        })
        mock.url('/status', {
            type: 'get',
            data: {
                $pass: {
                    status: 300
                },
                $fail: {
                    status: 404
                }
            }
        })
    it('should return status 404', function (done) {
        request(app)
        .get('/status404')
        .expect(404)
        .then(res => {
            Object.keys(res.body).should.eql(['type'])
            res.body.type.should.equal('pass')
            done()
        })
    })
    it('should return status 300', function (done) {
        request(app)
        .get('/status')
        .expect(300)
        .then(res => {
            Object.keys(res.body).should.eql(['type'])
            res.body.type.should.equal('pass')
            done()
        })
    })
        mock.url('/header_name_nimo', {
            type: 'get',
            header: {
                name: 'nimo'
            }
        })
        mock.url('/header', {
            type: 'get',
            data: {
                $pass: {
                    header: {
                        a: 'pass'
                    }
                },
                $fail: {
                    header: {
                        a: 'fail'
                    }
                },
                mock: {

                },
                $mock: {
                    header: {
                        'name': "@email"
                    }
                }
            }
        })
    it('should return header_name_nimo', function (done) {
        request(app)
        .get('/header_name_nimo')
        .expect('name', 'nimo')
        .then(res => {
            done()
        })
    })
    it('should return header pass', function (done) {
        request(app)
        .get('/header')
        .expect('a', 'pass')
        .then(res => {
            done()
        })
    })
    it('should return header fail', function (done) {
        request(app)
        .get('/header?_=fail')
        .expect('a', 'fail')
        .then(res => {
            done()
        })
    })
    it('should return header mock', function (done) {
        request(app)
        .get('/header?_=mock')
        .then(res => {
            res.headers['name'].should.match(/@/)
            res.headers['name'].should.match(/\./)
            done()
        })
    })

        mock.url('/cookie_name_nimo', {
            type: 'get',
            cookie: {
                cname: 'nimo'
            }
        })
        mock.url('/cookie', {
            type: 'get',
            data: {
                $pass: {
                    cookie: {
                        ca: 'pass'
                    }
                },
                $fail: {
                    cookie: {
                        ca: 'fail'
                    }
                },
                mock: {

                },
                $mock: {
                    cookie: {
                        'name': "@email"
                    }
                }
            }
        })
    it('should return cookie_name_nimo', function (done) {
        request(app)
        .get('/cookie_name_nimo')
        .then(res => {
            JSON.stringify(res.headers['set-cookie']).should.match(/cname\=nimo/)
            done()
        })
    })
    it('should return cookie pass', function (done) {
        request(app)
        .get('/cookie')
        .then(res => {
            JSON.stringify(res.headers['set-cookie']).should.match(/ca\=pass/)
            done()
        })
    })
    it('should return cookie fail', function (done) {
        request(app)
        .get('/cookie?_=fail')
        .then(res => {
            JSON.stringify(res.headers['set-cookie']).should.match(/ca\=fail/)
            done()
        })
    })
    it('should return cookie mock', function (done) {
        request(app)
        .get('/cookie?_=mock')
        .then(res => {
            JSON.stringify(res.headers['set-cookie']).should.match(/\%40/)
            JSON.stringify(res.headers['set-cookie']).should.match(/\./)
            done()
        })
    })
        mock.url('/mockcontrol', {
            type: 'get',
            data: {
                pass: {
                    email: '@email'
                },
                mock: {
                    email: '@email'
                },
                $mock: {
                    mock: true
                }
            },
            mock: false
        })
    it('shout return source data mock=false', function (done) {
        request(app)
        .get('/mockcontrol')
        .then(res => {
            res.body.email.should.eql('@email')
            done()
        })
    })
    it('shout return mock data mock=true', function (done) {
        request(app)
        .get('/mockcontrol?_=mock')
        .then(res => {
            res.body.email.should.match(/@/)
            res.body.email.should.match(/\./)
            done()
        })
    })
})
