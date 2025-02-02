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

3. Create `host.json` in the `azure-functions/weather-alert` directory with the following content:
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

7. Trigger the Azure Function by making a POST request to `http://localhost:7071/api/weather-alert` with the following JSON payload:
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

## Publishing the Docker Image to Azure Container Registry

1. Login to your Azure account:
   ```sh
   az login
   ```

2. Create an Azure Container Registry (if you don't have one):
   ```sh
   az acr create --resource-group <resource-group-name> --name <registry-name> --sku Basic
   ```

3. Build and push the Docker image to Azure Container Registry:
   ```sh
   az acr build --registry <registry-name> --image yatri-weather:latest .
   ```

## Contributing

We welcome contributions to Weather Yatri! Please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch to your fork.
4. Open a pull request with a detailed description of your changes.

For more details, see the [CONTRIBUTING.md](CONTRIBUTING.md) file.
