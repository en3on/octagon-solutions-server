const request = require('supertest');

async function postRequest(api, payload, url) {
  const headers = {
    'Accept': 'application/json',
    'test': 'true',
  };

  return await request(api)
      .post(url)
      .send(payload)
      .set(headers);
};

async function fileUploadHelper(api, token, url) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'token': token,
    'descriptions': ['test 1', 'test 2', 'test 3', 'test 4'],
  };

  return await request(api)
      .post(url)
      .field('descriptions', ['file 1', 'file 2'])
      .attach('documents', 'test/utils/files/1.txt')
      .attach('documents', 'test/utils/files/2.txt')
      .set(headers);
};

module.exports = {
  postRequest,
  fileUploadHelper,
};
