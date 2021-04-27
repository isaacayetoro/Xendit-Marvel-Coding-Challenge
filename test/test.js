
const chai = require('chai');
const chaiHttp = require('chai-http');

const redis = require("redis");


// instantiate redis
const client = redis.createClient();

client.on("error", function(error) {
  console.error(error);
});

let routes = require('../api/routes');
var should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);
describe('Marvel Characters APIs', () => {
    // beforeEach((done) => {
    //     // flush the redis db
    //     client.flushdb();
    //     done();
    // });

    /** Test the GET /characters */
    describe('/GET characters', () => {
        it('this should GET all Marvel Characters depending on the limit set', (done) => {
            chai.request(routes).get('/characters').end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                done();
            });
        });
    });

    /** Test the GET /characters/:characterId */
    describe('/GET/:characterId characterIds', () => {
        it('this should GET a character by the given id', (done) => {
            chai.request(routes).get('/characters/1011334').end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('name');
                expect(res.body).to.have.property('description');
                expect(res.body).to.have.property('id').eql(1011334);
                done();
            });
        });
    });
});