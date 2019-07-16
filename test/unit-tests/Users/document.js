const should = require('chai').should();

/* require models */
const User = require('../../../models/User.js');
const Document = require('../../../models/Document.js');

/* require helpers */
const {postRequest, fileUploadHelper} = require('../../utils/post-request-helpers.js');

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

  afterEach(async () => {
    await User.updateOne({_id: user.id}, {documents: []});
    api.close();
  });

  context('as a signed in user', () => {
    it('responds with 201', async () => {
      const res = await fileUploadHelper(api, token, url);

      res.status.should.equal(201);
    }).timeout(20000);
  });
});
