const request = require('supertest');

async function deleteFileHelper(api, token, public_id, url) {
  const headers = {
    'token': token,
    'test': true,
  };

  return await request(api)
    .del(url + `/${public_id}`)
    .set(headers);
};

module.exports = deleteFileHelper;
