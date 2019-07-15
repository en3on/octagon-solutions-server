const should = require('chai').should();

// needed to create id
const mongoose = require('mongoose');

/* require models */
const User = require('../../../models/User.js');

/* require helpers */
const {postRequest} = require('../../utils/post-request-helpers.js');

let api;
let url;
let user;

describe('POST /auth/login', () => {
  beforeEach(async () => {
    api = require('../../../api.js');
    url = '/auth/login';
    user = {
      _id: new mongoose.Types.ObjectId(),
      firstName: 'Bill',
      lastName: 'Clinton',
      email: 'billc@whitehouse.com',
      password: 'Hillary2001',
    };

    await postRequest(api, user, '/auth/register');
  });

  afterEach(async () => {
    await User.deleteOne({email: user.email});
    api.close();
  });

  context('with valid params', () => {
    it('responds with 200', async () => {
      const res = await postRequest(api, user, url);

      res.status.should.equal(200);
    });

    it('responds with a token', async () => {
      const res = await postRequest(api, user, url);

      should.exist(res.body.token);
    });
  });
});
