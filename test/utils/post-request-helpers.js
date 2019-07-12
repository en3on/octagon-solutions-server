const request = require('supertest');

async function postRequest(api, payload, url) {
  return await request(api)
    .post(url)
    .send(payload)
    .set('Accept', 'application/json');
};

module.exports = {
  postRequest,
};
