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

## Creating an Azure App Service Web App

1. Create an Azure App Service Web App:
   ```sh
   az webapp create --resource-group <resource-group-name> --plan <app-service-plan> --name <app-name> --runtime "NODE|14-lts"
   ```

2. Configure the web app to use a custom domain (if needed):
   ```sh
   az webapp config hostname add --resource-group <resource-group-name> --webapp-name <app-name> --hostname <custom-domain>
   ```

## Testing the Application Using Azure Container Instance

1. Create an Azure Container Instance:
   ```sh
   az container create --resource-group <resource-group-name> --name <container-name> --image <registry-name>.azurecr.io/yatri-weather:latest --cpu 1 --memory 1 --registry-login-server <registry-name>.azurecr.io --registry-username P13ea --registry-password Pb7a9 --ports 5173
   ```

2. Check the status of the container instance:
   ```sh
   az container show --resource-group <resource-group-name> --name <container-name> --query "{FQDN:ipAddress.fqdn, ProvisioningState:provisioningState}"
   ```

## Integrating Azure Function with the Web Application

1. Deploy the Azure Function to Azure:
   ```sh
   func azure functionapp publish <function-app-name>
   ```

2. Update the web application to call the Azure Function for weather alerts:
   - Modify the API URL in the web application to point to the deployed Azure Function.

## Deploying the Web Application to Azure Container Apps

1. Create an Azure Container App environment:
   ```sh
   az containerapp env create --name <env-name> --resource-group <resource-group-name> --location <location>
   ```

2. Create an Azure Container App:
   ```sh
   az containerapp create --name <app-name> --resource-group <resource-group-name> --environment <env-name> --image <registry-name>.azurecr.io/yatri-weather:latest --target-port 5173 --ingress 'external'
   ```

## Setting Up a CI/CD Pipeline

1. Create a GitHub Actions workflow file in the `.github/workflows` directory:
   ```yaml
   name: CI/CD Pipeline

   on:
     push:
       branches:
         - main

   jobs:
     build:
       runs-on: ubuntu-latest

       steps:
         - name: Checkout code
           uses: actions/checkout@v2

         - name: Set up Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '14'

         - name: Install dependencies
           run: npm install

         - name: Build the application
           run: npm run build

         - name: Login to Azure Container Registry
           run: |
             echo ${{ secrets.AZURE_CREDENTIALS }} | docker login <registry-name>.azurecr.io --username P13ea --password-stdin

         - name: Build and push Docker image
           run: |
             docker build -t <registry-name>.azurecr.io/yatri-weather:latest .
             docker push <registry-name>.azurecr.io/yatri-weather:latest

         - name: Deploy to Azure Container Apps
           run: |
             az containerapp update --name <app-name> --resource-group <resource-group-name> --image <registry-name>.azurecr.io/yatri-weather:latest
   ```

## Setting Up Application Insights and Azure Monitor

1. Create an Application Insights resource:
   ```sh
   az monitor app-insights component create --app <app-name> --location <location> --resource-group <resource-group-name> --application-type web
   ```

2. Configure the web application to use Application Insights:
   - Add the Application Insights SDK to the web application.
   - Initialize the Application Insights SDK with the instrumentation key.

3. Set up Azure Monitor alerts:
   ```sh
   az monitor metrics alert create --name <alert-name> --resource-group <resource-group-name> --scopes <app-insights-resource-id> --condition "avg request duration > 1" --description "Alert when average request duration exceeds 1 second"
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
