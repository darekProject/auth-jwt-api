import 'babel-polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import User from '../models/user';

import app from '../app';

chai.should();
chai.use(chaiHttp);

const unique = (Math.random() * 1000) + 1;
const user = {
    email: `darek${unique}@test.com`,
    password: 'test123'
};
let existingUser = null;

describe('test all endpoint', () => {
    describe('POST /app', () => {
        it('should create user', (done) => {
            chai.request(app)
                .post('/api/user/add')
                .send({data: user})
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('token');
                    res.body.data.should.have.property('email');
                    res.body.data.email.should.equal(user.email);
                    done();
                });
        });
    });

    describe('POST /login', () => {
        it('user login', (done) => {
            chai.request(app)
                .post('/api/user/login')
                .send({data: user})
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.header.should.have.property('x-auth');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('token');
                    done();
                });
        });
    });

    describe('POST /change_email', () => {
        beforeEach(async () => {
            existingUser = await User.findOne({email: user.email});
        });
        it('should change email', (done) => {
            const unique = (Math.random() * 1000) + 1;
            const reqData = {
                email: `new${unique}Email@test.com`
            };
            chai.request(app)
                .post('/api/user/change_email')
                .set('x-auth', existingUser.tokens[0].token)
                .send({data: reqData})
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('data');
                    res.body.data.email.should.equal(reqData.email);
                    done();
                });
        });
    });

    describe('DELETE /logout', () => {
        it('should logout user', (done) => {
            chai.request(app)
                .delete('/api/user/logout')
                .set('x-auth', existingUser.tokens[0].token)
                .end((err, res) => {
                    if (err) return done(err);

                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('status');
                    res.body.status.should.equal('success');

                    done();
                });
        });
    });
});
