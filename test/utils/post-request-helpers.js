const request = require('supertest');

/**
 * helper for sending POST requests to api
 * @param {Function} api express api
 * @param {Object} payload json to be sent to api
 * @param {String} url path for request
 * @return {Object} response object
 */
async function postRequest(api, payload, url) {
  return await request(api)
      .post(url)
      .send(payload)
      .set('Accept', 'application/json');
};

module.exports = {
  postRequest,
};
