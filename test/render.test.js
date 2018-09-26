var request = require('supertest')
var createApp = require('./createApp')
var should = require('chai').should()
var fs = require('fs')
var mock
const app = createApp(function (webmock) {
    mock = webmock
})

describe('render.test.js', function() {
        mock.render('/ejs', {
            view: 'render/ejs.html',
            data: {
                pass: {
                    email: 'mail@qq.com'
                },
                fail: {
                    msg: 'mail@qq.com is spam'
                }
            }
        })
    it('should return pass', function(done) {
        request(app)
        .get('/ejs')
        .expect(200)
        .then(res => {
            // fs.writeFileSync(__dirname + '/render/ejs-pass.html', res.text)
            res.text.should.eql(fs.readFileSync(__dirname + '/render/ejs-pass.html').toString())
            done()
        })
    })
    it('should return fail', function(done) {
        request(app)
        .get('/ejs?_=fail')
        .expect(200)
        .then(res => {
            // fs.writeFileSync(__dirname + '/render/ejs-fail.html', res.text)
            res.text.should.eql(fs.readFileSync(__dirname + '/render/ejs-fail.html').toString())
            done()
        })
    })

        mock.render('/mock', {
            view: 'render/mock.html',
            data: {
                pass: {
                    'age|100-200': 1,
                }
            }
        })
    it('should return mock data', function(done) {
        request(app)
        .get('/mock')
        .expect(200)
        .then(res => {
            var age = parseInt(res.text)
            age.should.above(99)
            age.should.below(201)
            done()
        })
    })
})
