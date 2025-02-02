# Weather Yatri

Weather Yatri provides accurate weather forecasts for cities worldwide.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yatricloud/weather-yatri.git
   cd weather-yatri
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Enter a city name in the search bar to get the weather forecast.

## Setting Up Azure Function for Weather Alerts

1. Install Azure Functions Core Tools:
   ```sh
   npm install -g azure-functions-core-tools@3
   ```

2. Navigate to the `azure-functions/weather-alert` directory:
   ```sh
   cd azure-functions/weather-alert
   ```

3. Start the Azure Function locally:
   ```sh
   func start
   ```

4. Configure environment variables for Twilio and OpenWeatherMap API:
   - `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
   - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
   - `TWILIO_PHONE_NUMBER`: Your Twilio phone number
   - `ALERT_PHONE_NUMBER`: The phone number to send alerts to
   - `WEATHER_API_KEY`: Your OpenWeatherMap API key

5. Trigger the Azure Function by making a POST request to `http://localhost:7071/api/weather-alert` with the following JSON payload:
   ```json
   {
     "city": "CityName",
     "threshold": TemperatureThreshold
   }
   ```

## Contributing

We welcome contributions to Weather Yatri! Please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch to your fork.
4. Open a pull request with a detailed description of your changes.

For more details, see the [CONTRIBUTING.md](CONTRIBUTING.md) file.
