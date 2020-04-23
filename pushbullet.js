const fetch = require('node-fetch');

let domain, token;

module.exports = class {

  constructor(domainParam, tokenParam) {
    domain = domainParam;
    token = tokenParam;
  }

  async sendPush(email, title, message) {
    const body = {type: 'note', email, title, body: message};

    fetch(`${domain}/v2/pushes`, {
    	method: 'post',
    	body: JSON.stringify(body),
    	headers: {
        'Content-Type': 'application/json',
        'Access-Token': token}
    })
    .then(res => res.json())
    .then(json => console.log(json));
  }

}
