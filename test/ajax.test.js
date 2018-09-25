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
})

describe('ajax.js', function() {
    it('should return pass data', function(done) {
        request(app)
        .post('/login?some=abc')
        .send('a=1')
        .expect(200)
        .then(res => {
            Object.keys(res.body).should.eql(['type', 'balance'])
            res.body.type.should.equal('pass')
            res.body.balance.should.above(99)
            res.body.balance.should.below(201)
            done()
        })
    })
})
