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

module.exports = {
  postRequest,
};
