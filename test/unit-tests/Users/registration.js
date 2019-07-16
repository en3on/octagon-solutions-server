const should = require('chai').should();

/* require models */
const User = require('../../../models/User.js');

/* require helpers */
const {postRequest} = require('../../utils/post-request-helpers.js');

let api;
let url;
let user;

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
  });

  afterEach(async () => {
    await User.deleteOne({email: user.email});
    api.close();
  });

  context('with valid params', () => {
    it('responds with 201', async () => {
      const res = await postRequest(api, user, url);

      res.status.should.equal(201);
    });

    it('creates a new user', async () => {
      await postRequest(api, user, url);

      const newUser = await User.findOne({email: user.email});

      newUser.firstName.should.equal(user.firstName);
    });

    it('returns a json web token', async () => {
      const res = await postRequest(api, user, url);

      should.exist(res.body.token);
    });
  });

  context('with invalid email', () => {
    beforeEach(() => {
      user.email = 'invalidmail';
    });

    it('should respond with 400', async () => {
      const res = await postRequest(api, user, url);

      res.status.should.equal(400);
    });
  });

  context('with invalid email domain', () => {
    beforeEach(() => {
      user.email = 'invalid@mail';
    });

    it('should respond with 400', async () => {
      const res = await postRequest(api, user, url);

      res.status.should.equal(400);
    });
  });

  context('missing paramters', () => {
    beforeEach(() => {
      user.firstName = undefined;
      user.email = undefined;
    });

    it('should respond with 400', async () => {
      const res = await postRequest(api, user, url);

      res.status.should.equal(400);
    });
  });
});
