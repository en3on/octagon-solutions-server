const request = require('supertest');

async function deleteFileHelper(api, token, publicId, url) {
  const headers = {
    'token': token,
    'test': true,
  };

  return await request(api)
      .del(url + `/${publicId}`)
      .set(headers);
};

module.exports = deleteFileHelper;
