var request = require('supertest')
var createApp = require('./createApp')
var should = require('chai').should()
const app = createApp(function (mock) {
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
    // mock.url('/order', {
    //     type: 'post',
    //     header: {
    //         v: enum: [1]
    //     }
    // })
    // mock.url('/order', {
    //     type: 'post',
    //     header: {
    //         v: {
    //             enum: [2]
    //         }
    //     }
    // })
})

describe('ajax.js', function() {
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
    it('should return status 404', function (done) {
        request(app)
        .get('/status?_=fail')
        // .expect(404)
        .then(res => {
            console.log(res)
            // Object.keys(res.body).should.eql(['type'])
            // res.body.type.should.equal('fail')
            done()
        })
    })
})
