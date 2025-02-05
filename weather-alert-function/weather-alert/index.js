module.exports = async function (context, req) {
    context.log('Weather alert function processed a request.');

    const { city, temperature } = req.body;

    if (!city || temperature === undefined) {
        context.res = {
            status: 400,
            body: "Please provide both city and temperature"
        };
        return;
    }

    const threshold = 20; // Temperature threshold in Celsius
    let alertMessage = '';

    if (temperature < threshold) {
        alertMessage = `Alert: Temperature in ${city} is below ${threshold}°C (Current: ${temperature}°C)`;
    }

    context.res = {
        status: 200,
        body: {
            message: alertMessage,
            city,
            temperature,
            threshold
        }
    };
};