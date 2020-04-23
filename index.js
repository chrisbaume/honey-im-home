const PushBulletAPI = require('./pushbullet.js');
const HuxleyAPI = require('./huxley.js');
const TflAPI = require('./tfl.js');
const dayjs = require('dayjs');

const pb = new PushBulletAPI(process.env.PUSHBULLET_DOMAIN, process.env.PUSHBULLET_TOKEN);
const hx = new HuxleyAPI(process.env.HUXLEY_DOMAIN, process.env.DARWIN_TOKEN);
const tfl = new TflAPI(process.env.TFL_DOMAIN, process.env.TFL_ID, process.env.TFL_KEY);

async function nextTube(time, station, line, direction) {
  let arrivals = await tfl.arrivals(station, line, direction);
  let nextTube = tfl.firstAfter(arrivals, time);
  return dayjs(nextTube.expectedArrival);
}

async function nextTrain(time, from, to) {
  let departures = await hx.departures(from, to);
  let callingPoints = [];
  for (const departure of departures) {
    callingPoints.push(departure.subsequentCallingPoints[0].callingPoint.filter(station => station.crs===to)[0]);
  }
  callingPoints = hx.sortCallingPoints(callingPoints);
  let nextTrain = hx.firstCallingPointAfter(callingPoints, time);
  return dayjs(nextTrain.st,"HH:mm");
}

exports.handler = async function(event, context)
{
  let prevTime = dayjs();
  for (item of event.route) {
    console.log(prevTime.format());
    if (typeof item === "number") {
      prevTime = prevTime.add(item, 'm');
    } else if (typeof item === "object" && item.hasOwnProperty('tube')) {
      prevTime = await nextTube(prevTime, item.tube.station, item.tube.line, item.tube.direction);
    } else if (typeof item === "object" && item.hasOwnProperty('rail')) {
      prevTime = await nextTrain(prevTime, item.rail.from, item.rail.to);
    } else {
      throw "Unexpected item in route";
    }
  }
  console.log(prevTime.format());
  //await pb.sendPush(event.recipient,'ETA', prevTime.format());
}
