const should = require('chai').should();

/* require models */
const User = require('../../../models/User.js');

/* require helpers */
const {postRequest, fileUploadHelper} =
  require('../../utils/post-request-helpers.js');

let url;
let user;
let api;
let token;
let fileStatus;

describe('POST /documents/upload', () => {
  before(async function() {
    this.timeout(20000);
    api = require('../../../api.js');
    url = '/documents/upload';
    user = await User.findOne({email: 'test@user.com'});
    user.password = 'TestPass123';

    const res = await postRequest(api, user, '/auth/login');
    token = res.body.token;

    console.log('Uploading files...');
    fileStatus = await fileUploadHelper(api, token, url);
  });

  afterEach(async () => {
    api.close();
  });

  after(async () => {
    await User.updateOne({_id: user.id}, {documents: []});
  });

  context('as a signed in user', () => {
    it('responds with 201', async () => {
      fileStatus.status.should.equal(201);
    }).timeout(20000);

    it('responds with json object of documents', async () => {
      fileStatus.body.should.have.property('documentsArr').with.lengthOf(2);
    });

    context('with no files selected', () => {
      before(async function() {
        fileStatus = await fileUploadHelper(api, token, url, false);
      });

      it('responds with 400', async () => {
        fileStatus.status.should.equal(400);
      });
    });
  });
});
