# Honey, I'm Home!

This is a web application that calculates how long it will take you to get home from work and lets your partner know. It uses the [Transport for London Unified API](https://api.tfl.gov.uk/) and [Open Live Departure Boards Web Service](http://lite.realtime.nationalrail.co.uk/openldbws/) (using [Huxley](https://huxley.unop.uk/)) to get accurate timings for London Underground and National Rail. It then uses the [PushBullet API](https://docs.pushbullet.com/) to send a push notification to your partner's phone. It's written using Node.js and designed to be run on AWS Lambda.

## Configuration

Add the following variables to `.env`:

- `DARWIN_TOKEN`: Token for OpenLDBWS (register [here](http://realtime.nationalrail.co.uk/OpenLDBWSRegistration/))
- `HUXLEY_DOMAIN`: Huxley server address (e.g. `https://huxley.apphb.com`)
- `TFL_DOMAIN`: TFL Unified API server (e.g. `https://api.tfl.gov.uk`)
- `TFL_ID`: Application ID for TFL Unified API (register [here](https://api-portal.tfl.gov.uk/))
- `TFL_KEY`: Application key for TFL Unified API
- `PUSHBULLET_DOMAIN`: Server for PushBullet (e.g. `https://api.pushbullet.com`)
- `PUSHBULLET_TOKEN`: Token for PushBullet

## Event format

### Route

`route` is an array that represents your route home. Each item in the array can be one of the following types:

#### Time delay
An integer is used to indicate a delay in minutes.
```
5
```

#### Tube journey
Calculates the time until the next tube leaves a station on a line going a certain direction. Find the line names [here](https://api.tfl.gov.uk/swagger/ui/index.html?url=/swagger/docs/v1#!/Line/Line_RouteByMode) and the station IDs [here](https://api.tfl.gov.uk/swagger/ui/index.html?url=/swagger/docs/v1#!/Line/Line_StopPoints). The inbound route is listed from top to bottom.
```
"tube": {
  "station": "940GZZLUKSX",
  "line": "hammersmith-city",
  "direction": "outbound"
}
```

#### Rail journey
Calculates the time until the next train from one stop to another. Station codes are listed [here](https://www.nationalrail.co.uk/stations_destinations/48541.aspx).
```
"rail": {
  "from": "STP",
  "to": "SAC"
}
```

### Recipient

`recipient` is the email address of the person to receive the push notification. They must have PushBullet installed on their phone.

### Example
The following example event describes:

1. 5-min walk
1. Wait for next eastbound Hammersmith and City train at Wood Lane
1. 25-min tube journey
1. 10-min walk to station platform
1. Wait for next train from St Pancras to St Albans
1. 20-min train journey
1. 5-min walk

with the notification sent to `test@test.com`

```
{
  "route": [
    5,
    {
      "tube": {
        "station": "940GZZLUKSX",
        "line": "hammersmith-city",
        "direction": "outbound"
      }
    },
    25,
    10,
    {
      "rail": {
        "from": "STP",
        "to": "SAC"
      }
    },
    20,
    5
  ],
  "recipient": "test@test.com"
}
```

## Usage

### Install
```
npm install
```

### Test
Create `event.json` with your configuration, then run
```
npm test
```
### Deploy
```
node-lambda deploy --endpoint http://localhost:4574 --accessKey '1234' --secretKey '1234'
```
