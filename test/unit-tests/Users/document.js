const should = require('chai').should();

/* require models */
const User = require('../../../models/User.js');
const Document = require('../../../models/Document.js');

/* require helpers */
const {postRequest} = require('../../utils/post-request-helpers.js');

let url;
let user;
let api;
let token;

describe('POST /documents/upload', () => {

  beforeEach(async () => {
    api = require('../../../api.js');
    url = '/documents/upload';
    user = await User.findOne({email: 'test@user.com'});
    user.password = 'TestPass123';

    const res = await postRequest(api, user, '/auth/login');
    token = res.body.token;
  });

  afterEach(() => {
    api.close();
  });

  context('as a signed in user', () => {
    it('responds with 201', async () => {
      const payload = {token: token};
      const res = await postRequest(api, payload, url);

      res.status.should.equal(201);
    });
  });
});
