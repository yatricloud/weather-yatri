# Project Demo: Weather Yatri Azure Setup

This guide provides detailed instructions for setting up the Weather Yatri application on Azure using the specified resource names.

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
   az group create --name weather-yatri-rg --location <location>
   ```

3. **Create a Storage Account:**
   ```sh
   az storage account create --name weatheryatristorage --resource-group weather-yatri-rg --location <location> --sku Standard_LRS
   ```

4. **Create an Azure Function App:**
   ```sh
   az functionapp create --resource-group weather-yatri-rg --consumption-plan-location <location> --runtime node --functions-version 3 --name weather-yatri-func --storage-account weatheryatristorage
   ```

5. **Create an Azure App Service:**
   ```sh
   az webapp create --resource-group weather-yatri-rg --plan <app-service-plan> --name weather-yatri-app --runtime "NODE|14-lts"
   ```

## Step 2: Deploy the Azure Function

1. **Navigate to the Azure Function directory:**
   ```sh
   cd azure-functions/weather-alert
   ```

2. **Deploy the Azure Function:**
   ```sh
   func azure functionapp publish weather-yatri-func
   ```

## Step 3: Configure Environment Variables

1. **Set the WEATHER_API_KEY environment variable:**
   ```sh
   az functionapp config appsettings set --name weather-yatri-func --resource-group weather-yatri-rg --settings "WEATHER_API_KEY=<your-weather-api-key>"
   ```

2. **Verify the environment variable is set:**
   ```sh
   az functionapp config appsettings list --name weather-yatri-func --resource-group weather-yatri-rg
   ```

## Step 4: Test the Azure Function

1. **Trigger the Azure Function by making a POST request:**
   ```sh
   curl -X POST https://<your-function-app-name>.azurewebsites.net/api/weather-alert -H "Content-Type: application/json" -d '{"city": "CityName", "threshold": TemperatureThreshold}'
   ```

2. **Verify the response to ensure the function is working correctly.**

## Step 5: Clean Up Resources

1. **Delete the Resource Group to clean up all resources:**
   ```sh
   az group delete --name weather-yatri-rg --yes --no-wait
   ```

By following these steps, you can successfully set up the Weather Yatri application on Azure using the specified resource names. For any issues or further assistance, refer to the Azure documentation or contact support.
