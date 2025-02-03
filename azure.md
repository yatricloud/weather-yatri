# Deploying Weather Yatri from Azure Portal

This guide provides detailed instructions for deploying the Weather Yatri application from the Azure portal. Follow the steps below to set up Azure resources, deploy the Azure Function, and configure environment variables.

## Prerequisites

Before you begin, ensure you have the following:

- An active Azure subscription
- Azure CLI installed on your local machine
- Azure Functions Core Tools installed on your local machine
- Docker installed on your local machine

## Step 1: Set Up Azure Resources

1. **Login to Azure:**
   ```sh
   az login
   ```

2. **Create a Resource Group:**
   ```sh
   az group create --name WeatherYatriResourceGroup --location eastus
   ```

3. **Create a Storage Account:**
   ```sh
   az storage account create --name weatheryatristorage --resource-group WeatherYatriResourceGroup --location eastus --sku Standard_LRS
   ```

4. **Create an Azure Function App:**
   ```sh
   az functionapp create --resource-group WeatherYatriResourceGroup --consumption-plan-location eastus --runtime node --functions-version 4 --name WeatherYatriFunctionApp --storage-account weatheryatristorage
   ```

## Step 2: Deploy the Azure Function

1. **Navigate to the Azure Function directory:**
   ```sh
   cd azure-functions/weather-alert
   ```

2. **Deploy the Azure Function:**
   ```sh
   func azure functionapp publish WeatherYatriFunctionApp --force
   ```

## Step 3: Configure Environment Variables

1. **Set the WEATHER_API_KEY environment variable:**
   ```sh
   az functionapp config appsettings set --name WeatherYatriFunctionApp --resource-group WeatherYatriResourceGroup --settings "WEATHER_API_KEY=<your-weather-api-key>"
   ```

2. **Verify the environment variable is set:**
   ```sh
   az functionapp config appsettings list --name WeatherYatriFunctionApp --resource-group WeatherYatriResourceGroup
   ```

## Step 4: Test the Azure Function

1. **Trigger the Azure Function by making a POST request:**
   ```sh
   curl -X POST https://<your-function-app-name>.azurewebsites.net/api/weather-alert -H "Content-Type: application/json" -d '{"city": "CityName", "threshold": TemperatureThreshold}'
   ```

2. **Verify the response to ensure the function is working correctly.**

## Step 5: Deploy the Container App to Azure Container Apps

1. **Create an Azure Container App environment:**
   ```sh
   az containerapp env create --name WeatherYatriEnv --resource-group WeatherYatriResourceGroup --location eastus
   ```

2. **Create an Azure Container App:**
   ```sh
   az containerapp create --name WeatherYatriApp --resource-group WeatherYatriResourceGroup --environment WeatherYatriEnv --image <your-dockerhub-username>/yatri-weather:latest --target-port 5173 --ingress 'external'
   ```

## Step 6: Obtain the Live URL for the Container App

1. **Get the live URL for the container app:**
   ```sh
   az containerapp show --name WeatherYatriApp --resource-group WeatherYatriResourceGroup --query properties.configuration.ingress.fqdn
   ```

## Step 7: Clean Up Resources

1. **Delete the Resource Group to clean up all resources:**
   ```sh
   az group delete --name WeatherYatriResourceGroup --yes --no-wait
   ```

By following these steps, you can successfully deploy the Weather Yatri application from the Azure portal. For any issues or further assistance, refer to the Azure documentation or contact support.
