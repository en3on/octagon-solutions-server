const should = require('chai').should();
const request = require('supertest');
const User = require('../../../models/User.js');

let api, user, url;

describe('POST /auth/register', () => {
  beforeEach(() => {
    api = require('../../../api.js');
    url = '/auth/register';
    user = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'johnsmith@gmail.com',
      password: 'Password1234',
    };
  })

  afterEach(async () => {
    await User.deleteOne({email: user.email});
    api.close();
  })

  context('with valid params', () => {
    it('responds with 201', async () => {
      const res = await request(api)
        .post(url)
        .send(user)
        .set('Accept', 'application/json');

      res.status.should.equal(201);
    });

    it('creates a new user', async () => {
      const res = await request(api)
        .post(url)
        .send(user)
        .set('Accept', 'application/json');

      const newUser = await User.findOne({email: user.email});

      newUser.firstName.should.equal(user.firstName);
    })

    it('returns a json web token', async () => {
      const res = await request(api)
        .post(url)
        .send(user)
        .set('Accept', 'application/json');

      should.exist(res.body.token);
    })
  });

  context('with invalid email', () => {
    beforeEach(() => {
      user.email = 'invalidmail';
    });

    it('should respond with 400', async () => {
      const res = await request(api)
        .post(url)
        .send(user)
        .set('Accept', 'application/json');

      res.status.should.equal(400);
    })
  });

  context('missing paramters', () => {
    beforeEach(() => {
      user.firstName = undefined;
      user.email = undefined;
    });

    it('should respond with 400', async () => {
      const res = await request(api)
        .post(url)
        .send(user)
        .set('Accept', 'application/json');

      res.status.should.equal(400);
    })
  })
});
