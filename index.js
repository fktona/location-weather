const express = require('express');
const axios = require('axios');
const app = express();


app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name;
  console.log('Visitor name:', visitorName);
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('Client IP:', clientIp);

  try {
    const locationResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
    const city = locationResponse.data.city || 'Unknown';


    const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${locationResponse.data.latitude}&longitude=${locationResponse.data.longitude}&current_weather=true`);
    const temperature = weatherResponse.data.current_weather.temperature;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`
    });
  } catch (error) {
    res.status(500).json({ messege:'internal server error', error: error });
  }
});

exports.start = app;
