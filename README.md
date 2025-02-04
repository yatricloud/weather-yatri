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

1. Open your browser and navigate to `http://localhost:5173`.
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

3. Create `host.json` in the project root directory with the following content:
   ```json
   {
     "version": "2.0",
     "extensionBundle": {
       "id": "Microsoft.Azure.Functions.ExtensionBundle",
       "version": "[1.*, 2.0.0)"
     }
   }
   ```

4. Create `local.settings.json` in the `azure-functions/weather-alert` directory with the following content:
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "AzureWebJobsStorage": "UseDevelopmentStorage=true",
       "WEATHER_API_KEY": "1fa9ff4126d95b8db54f3897a208e91c"
     }
   }
   ```

5. Start the Azure Function locally:
   ```sh
   func start
   ```

6. Configure environment variables for OpenWeatherMap API:
   - `WEATHER_API_KEY`: Your OpenWeatherMap API key

7. Retrieve the invokeUrlTemplate after deploying the Azure Function:
   ```sh
   az functionapp function show --name WeatherYatriFunctionApp --resource-group WeatherYatriResourceGroup --function-name TemperatureCheck --query invokeUrlTemplate
   ```

8. Trigger the Azure Function by making a POST request to the retrieved `invokeUrlTemplate` with the following JSON payload:
   ```json
   {
     "city": "CityName",
     "threshold": TemperatureThreshold
   }
   ```

## Containerizing the Application

1. Build the Docker image:
   ```sh
   npm run docker:build
   ```

2. Run the Docker container locally:
   ```sh
   npm run docker:run
   ```

## Publishing the Docker Image to Docker Hub

1. Login to Docker Hub:
   ```sh
   docker login
   ```

2. Tag the Docker image:
   ```sh
   docker tag yatri-weather <your-dockerhub-username>/yatri-weather:latest
   ```

3. Push the Docker image to Docker Hub:
   ```sh
   npm run docker:push:hub
   ```

## Creating an Azure Container App

1. Create an Azure Container App environment:
   ```sh
   az containerapp env create --name WeatherYatriEnv --resource-group WeatherYatriResourceGroup --location eastus
   ```

2. Create an Azure Container App:
   ```sh
   az containerapp create --name WeatherYatriApp --resource-group WeatherYatriResourceGroup --environment WeatherYatriEnv --image yatricloud/yatri-weather:latest --target-port 5173 --ingress 'external'
   ```

3. Obtain the live URL for the container app:
   ```sh
   az containerapp show --name WeatherYatriApp --resource-group WeatherYatriResourceGroup --query properties.configuration.ingress.fqdn
   ```

## Contributing

We welcome contributions to Weather Yatri! Please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch to your fork.
4. Open a pull request with a detailed description of your changes.

For more details, see the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## Deploying from Azure Portal

For detailed instructions on deploying the application from the Azure portal, refer to the [azure.md](azure.md) file.
