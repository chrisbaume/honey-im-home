const fetch = require('node-fetch');
const dayjs = require('dayjs');

let domain, id, key;

async function query(url, options) {
  try {
    let params = new URLSearchParams({
      app_id: id,
      app_key: key,
      ...options
    });
    const res = await fetch(`${domain}${url}?${params}`);
    const json = await res.json();
    return json;
  } catch (error) {
    console.log('ERROR:', error);
  }
}

module.exports = class {

  constructor(domainParam, idParam, keyParam) {
    domain = domainParam;
    id = idParam;
    key = keyParam;
  }

  async arrivals(station, line, direction) {
    let body = await query(`/Line/${line}/Arrivals/${station}`, {direction});
    return body;
  }

  firstAfter(services, time) {
    for (const service of services) {
      if (dayjs(service.expectedArrival).isAfter(time)) return service;
    }
  }
}
