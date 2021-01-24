var mqtt = require('mqtt')

const http = require('http')
const { SSL_OP_EPHEMERAL_RSA } = require('constants')
const { timeStamp } = require('console')

const optionsTemp = {
    hostname: '192.168.11.203',
    port: 8123,
    json: true,
    path: '/api/states/sensor.lumi_lumi_weather_68a77102_temperature',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI4MGE3NTM0MDY5MjU0ZDE3OTY5ZDBjMTRlNDE1YTg0YSIsImlhdCI6MTYxMTI4NjA5MCwiZXhwIjoxOTI2NjQ2MDkwfQ.-PcZ6i3aHdIue8UBOAzhzJv_p5U9UbQFzxKaQqJdiSE'
    }
}
const optionsHum = {
    hostname: '192.168.11.203',
    port: 8123,
    json: true,
    path: '/api/states/sensor.lumi_lumi_weather_68a77102_humidity',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI4MGE3NTM0MDY5MjU0ZDE3OTY5ZDBjMTRlNDE1YTg0YSIsImlhdCI6MTYxMTI4NjA5MCwiZXhwIjoxOTI2NjQ2MDkwfQ.-PcZ6i3aHdIue8UBOAzhzJv_p5U9UbQFzxKaQqJdiSE'
    }
}
const optionsPres = {
    hostname: '192.168.11.203',
    port: 8123,
    json: true,
    path: '/api/states/sensor.lumi_lumi_weather_68a77102_pressure',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI4MGE3NTM0MDY5MjU0ZDE3OTY5ZDBjMTRlNDE1YTg0YSIsImlhdCI6MTYxMTI4NjA5MCwiZXhwIjoxOTI2NjQ2MDkwfQ.-PcZ6i3aHdIue8UBOAzhzJv_p5U9UbQFzxKaQqJdiSE'
    }
}

var temp, hum, pres

const req1 = http.request(optionsTemp, (res) => {
    res.on('data', function(data) {
        temp = JSON.parse(data).state
        const req2 = http.request(optionsHum, (res) => {
            res.on('data', function(data) {
                hum = JSON.parse(data).state
                const req3 = http.request(optionsPres, (res) => {
                    res.on('data', function(data) {
                        pres = JSON.parse(data).state
                        publishData(temp, hum, pres);
                    });
                });
                req3.end()
            });
        });
        req2.end()
    });
});
req1.end()





function publishData(t, h, p) {

    var client = mqtt.connect('mqtt://192.168.11.202')

    client.on('connect', function() {


        var baroMbar = parseFloat(p);
        var baroinHg = (baroMbar / 33.864)

        var hum = h;

        var tempC = parseFloat(t);

        var tempF = (tempC * 1.8) + 32

        console.log(tempC + '--' + tempF)
        console.log(baroMbar + '--' + baroinHg)

        var mqttMsg = 'barometer=' + baroinHg + ', inTemp=' + tempF + ', inHumidity=' + hum;

        client.publish('weewx', mqttMsg)
        console.log('published to mqtt ok')

        client.end();

    })

}