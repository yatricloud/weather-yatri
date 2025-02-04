const axios = require("axios");

const weatherApiKey = process.env.WEATHER_API_KEY;
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";

module.exports = async function (context, req) {
    const city = req.query.city || (req.body && req.body.city); // Supports both GET & POST

    if (!city) {
        context.res = {
            status: 400,
            body: { error: "City parameter is required." }
        };
        return;
    }

    try {
        const response = await axios.get(weatherApiUrl, {
            params: { q: city, units: "metric", appid: weatherApiKey }
        });

        const temperature = response.data.main.temp;
        const alertMessage = temperature < 20
            ? `⚠️ Temperature Alert: ${temperature}°C in ${city}!`
            : `✅ Temperature is normal at ${temperature}°C in ${city}.`;

        context.res = {
            status: 200,
            headers: { "Access-Control-Allow-Origin": "*" }, // Allows frontend access
            body: { alert: temperature < 20, message: alertMessage }
        };

    } catch (error) {
        context.res = {
            status: 500,
            body: { error: `Failed to fetch weather data: ${error.message}` }
        };
    }
};
