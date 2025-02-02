const axios = require('axios');

const weatherApiKey = process.env.WEATHER_API_KEY;
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';

module.exports = async function (context, req) {
    const { city, threshold } = req.body;

    try {
        const response = await axios.get(weatherApiUrl, {
            params: {
                q: city,
                units: 'metric',
                appid: weatherApiKey
            }
        });

        const weatherData = response.data;
        const temperature = weatherData.main.temp;

        if (temperature > threshold) {
            context.res = {
                status: 200,
                body: `Alert! The temperature in ${city} is ${temperature}°C, which is above your threshold of ${threshold}°C.`
            };
        } else {
            context.res = {
                status: 200,
                body: `No alert needed. The temperature in ${city} is ${temperature}°C.`
            };
        }
    } catch (error) {
        context.res = {
            status: 500,
            body: `Error fetching weather data: ${error.message}`
        };
    }
};
