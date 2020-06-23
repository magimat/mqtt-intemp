var mqtt = require('mqtt')

const https = require('https')
const options = {
  hostname: 'api.smartthings.com',
  port: 443,
  json: true,
  path: '/v1/devices/80bbde29-c3ad-4606-a7c0-4e4ed1f8380d/status',
  method: 'GET',
  headers: {
    'Authorization': 'xxxx'
  }
}

const req = https.request(options, (res) => {
    res.on('data', function (data) {
        publishData(JSON.parse(data))
   });
});


req.end()


function publishData(d) {

    var client  = mqtt.connect('mqtt://192.168.11.202')
 
    client.on('connect', function () {
      

            var baroMbar = parseFloat(d.components.main.soundPressureLevel.soundPressureLevel.value);
            var baroinHg = (baroMbar / 33.864)
            
            var hum = d.components.main.relativeHumidityMeasurement.humidity.value;

            var tempC = parseFloat(d.components.main.temperatureMeasurement.temperature.value);

            var tempF = (tempC * 1.8) + 32
            
console.log(tempC + '--' + tempF)
console.log(baroMbar + '--' + baroinHg)

            var mqttMsg = 'barometer=' + baroinHg + ', inTemp=' + tempF + ', inHumidity=' + hum;

            client.publish('weewx', mqttMsg)
            console.log('published to mqtt ok')
  
            client.end();  
      
    })

}


 


