const fetch = require('node-fetch');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

let domain, token;

async function query(url, options) {
  try {
    const params = new URLSearchParams({
      accessToken: token,
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

  constructor(domainParam, tokenParam) {
    domain = domainParam;
    token = tokenParam;
  }

  async departures(from, to) {
    let body = await query(`/departures/${from}/to/${to}`,{expand: true});
    return body.trainServices;
  }

  async nextFastest(from, to) {
    let body = await query(`/fastest/${from}/to/${to}`, {timeOffset: 60});
    return body;
  }

  sortCallingPoints(callingPoints) {
    callingPoints.sort((a,b) => (dayjs(a.st,"HH:mm").isBefore(dayjs(b.st,"HH:mm"))?-1:1));
    return callingPoints;
  }

  firstCallingPointAfter(callingPoints, time) {
    for (const cp of callingPoints) {
      if (dayjs(cp.st,"HH:mm").isAfter(time)) return cp;
    }
  }
}
