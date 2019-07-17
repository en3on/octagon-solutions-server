const should = require('chai').should();

/* require models */
const User = require('../../../models/User.js');
const Document = require('../../../models/Document.js');

/* require helpers */
const {postRequest, fileUploadHelper} =
  require('../../utils/post-request-helpers.js');
const deleteFileHelper = require('../../utils/delete-request-helper.js');

let url;
let user;
let api;
let token;
let fileStatus;
let documentCount;

before(async function() {
  this.timeout(20000);
  api = require('../../../api.js');
  url = '/documents/upload';
  user = await User.findOne({email: 'test@user.com'});
  user.password = 'TestPass123';

  documentCount = user.documents.length;

  const res = await postRequest(api, user, '/auth/login');
  token = res.body.token;

  console.log('Uploading files...');
  fileStatus = await fileUploadHelper(api, token, url);
});

after(async () => {
  await User.updateOne({_id: user.id}, {documents: []});
});

describe('POST /documents/upload', () => {
  afterEach(async () => {
    api.close();
  });

  context('as a signed in user', () => {
    it('responds with 201', async () => {
      fileStatus.status.should.equal(201);
    }).timeout(20000);

    it('saves documents to User Model', async () => {
      const query = await User.findOne({_id: user.id});

      query.should.have.property('documents').with.lengthOf(documentCount + 2);
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

  context('as a guest', () => {
    before(async function() {
      fileStatus = await fileUploadHelper(api, '', url);
    });

    it('responds with 401', () => {
      fileStatus.status.should.equal(401);
    });
  });
});

describe('DELETE /documents/:publicId', () => {
  beforeEach(async function() {
    user = await User.findOne({email: 'test@user.com'}).populate('documents');

    url = '/documents/delete';

    const document = user.documents[0];

    deleteStatus = await deleteFileHelper(api, token, document.publicId, url);
  });

  afterEach(async function() {
    user = await User.findOne({email: user.email}).populate('documents');

    const modifiedDocument = user.documents[0];

    modifiedDocument.delete = false;

    modifiedDocument.save();
  });

  context('as a signed in user', () => {
    context('as the document owner', () => {
      it('responds with 200', async () => {
        deleteStatus.status.should.equal(200);
      });

      it('changes document.delete to true', async () => {
        user = await User.findOne({email: user.email}).populate('documents');

        user.documents[0].delete.should.equal(true);
      });

      context('when a document is already marked for deletion', () => {
        beforeEach(async () => {
          const markedDocument = user.documents[1];
          markedDocument.delete = true;
          markedDocument.save();

          deleteStatus =
              await deleteFileHelper(api, token, markedDocument.publicId, url);
        });

        it('should return 400', () => {
          deleteStatus.status.should.equal(400);
        });

        after(() => {
          console.log('After deletion check');
        });
      });
    });

    context('not as the document owner', () => {
      before(async function() {
        user = await User.findOne({email: 'test2@user.com'});
        user.password = 'TestPass123';

        const otherUser =
            await User.findOne({email: 'test@user.com'}).populate('documents');

        const otherDocument = otherUser.documents[0];

        const {publicId} = otherDocument;

        const res = await postRequest(api, user, '/auth/login');

        token = res.body.token;

        deleteStatus =
          await deleteFileHelper(api, token, publicId, url);
      });

      it('responds with 404', () => {
        deleteStatus.status.should.equal(404);
      });
    });
  });

  let otherDocument;

  context('as a guest', () => {
    before(async function() {
      token = undefined;

      const otherUser =
          await User.findOne({email: 'test@user.com'}).populate('documents');

      otherDocument = otherUser.documents[0];

      const {publicId} = otherDocument;

      deleteStatus =
        await deleteFileHelper(api, token, publicId, url);
    });

    it('responds with 401', () => {
      deleteStatus.status.should.equal(401);
    });

    it('does not flag document for deletion', async () => {
      const testDocument =
        await Document.findOne({_id: otherDocument.id});

      testDocument.delete.should.equal(false);
    });
  });
});
