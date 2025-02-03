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
   az group create --name weather-yatri-rg --location eastus
   ```

3. **Create a Storage Account:**
   ```sh
   az storage account create --name weatheryatristorage --resource-group weather-yatri-rg --location eastus --sku Standard_LRS
   ```

4. **Create an App Service Plan:**
   ```sh
   az appservice plan create --name weather-yatri-plan --resource-group weather-yatri-rg --sku B1 --is-linux
   ```

5. **Create an Azure Function App:**
   ```sh
   az functionapp create --resource-group weather-yatri-rg --consumption-plan-location eastus --runtime node --functions-version 3 --name weather-yatri-func --storage-account weatheryatristorage
   ```

6. **Create an Azure App Service:**
   ```sh
   az webapp create --resource-group weather-yatri-rg --plan weather-yatri-plan --name weather-yatri-app --runtime "NODE:20-lts"
   ```

## Step 2: Deploy the Azure Function

1. **Navigate to the Azure Function directory:**
   ```sh
   cd azure-functions/weather-alert
   ```

2. **Deploy the Azure Function:**
   ```sh
   func azure functionapp publish weather-yatri-func --javascript --force
   ```

## Step 3: Configure Environment Variables

1. **Set the WEATHER_API_KEY environment variable:**
   ```sh
   az functionapp config appsettings set --name weather-yatri-func --resource-group weather-yatri-rg --settings "WEATHER_API_KEY=1fa9ff4126d95b8db54f3897a208e91c"
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

## Step 5: Containerize the Application

1. **Build the Docker image:**
   ```sh
   npm run docker:build
   ```

2. **Run the Docker container locally:**
   ```sh
   npm run docker:run
   ```

## Step 6: Publish the Docker Image to Docker Hub

1. **Login to Docker Hub:**
   ```sh
   docker login
   ```

2. **Tag the Docker image:**
   ```sh
   docker tag yatri-weather <your-dockerhub-username>/yatri-weather:latest
   ```

3. **Push the Docker image to Docker Hub:**
   ```sh
   npm run docker:push
   ```

## Step 7: Publish the Docker Image to Azure Container Registry

1. **Login to your Azure account:**
   ```sh
   az login
   ```

2. **Create an Azure Container Registry (if you don't have one):**
   ```sh
   az acr create --resource-group weather-yatri-rg --name weatheryatriacr --sku Basic
   ```

3. **Build and push the Docker image to Azure Container Registry:**
   ```sh
   az acr build --registry weatheryatriacr --image yatri-weather:latest .
   ```

## Step 8: Test the Application Using Azure Container Instance

1. **Create an Azure Container Instance:**
   ```sh
   az container create --resource-group weather-yatri-rg --name weather-yatri-container --image weatheryatriacr.azurecr.io/yatri-weather:latest --cpu 1 --memory 1 --registry-login-server weatheryatriacr.azurecr.io --registry-username weatheryatriacr --registry-password <your-registry-password> --ports 80
   ```

2. **Check the status of the container instance:**
   ```sh
   az container show --resource-group weather-yatri-rg --name weather-yatri-container --query "{FQDN:ipAddress.fqdn, ProvisioningState:provisioningState}"
   ```

## Step 9: Integrate Azure Function with the Web Application

1. **Deploy the Azure Function to Azure:**
   ```sh
   func azure functionapp publish weather-yatri-func
   ```

2. **Update the web application to call the Azure Function for weather alerts:**
   - Modify the API URL in the web application to point to the deployed Azure Function.

## Step 10: Deploy the Web Application to Azure Container Apps

1. **Create an Azure Container App environment:**
   ```sh
   az containerapp env create --name weather-yatri-env --resource-group weather-yatri-rg --location eastus
   ```

2. **Create an Azure Container App:**
   ```sh
   az containerapp create --name weather-yatri-app --resource-group weather-yatri-rg --environment weather-yatri-env --image weatheryatriacr.azurecr.io/yatri-weather:latest --target-port 80 --ingress 'external'
   ```

3. **Obtain the live URL for the web app:**
   ```sh
   az containerapp show --name weather-yatri-app --resource-group weather-yatri-rg --query properties.configuration.ingress.fqdn
   ```

## Step 11: Set Up a CI/CD Pipeline

1. **Create a GitHub Actions workflow file in the `.github/workflows` directory:**
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
             echo ${{ secrets.AZURE_CREDENTIALS }} | docker login weatheryatriacr.azurecr.io --username weatheryatriacr --password-stdin

         - name: Build and push Docker image
           run: |
             docker build -t weatheryatriacr.azurecr.io/yatri-weather:latest .
             docker push weatheryatriacr.azurecr.io/yatri-weather:latest

         - name: Deploy to Azure Container Apps
           run: |
             az containerapp update --name weather-yatri-app --resource-group weather-yatri-rg --image weatheryatriacr.azurecr.io/yatri-weather:latest
   ```

## Step 12: Set Up Application Insights and Azure Monitor

1. **Create an Application Insights resource:**
   ```sh
   az monitor app-insights component create --app weather-yatri-app --location eastus --resource-group weather-yatri-rg --application-type web
   ```

2. **Configure the web application to use Application Insights:**
   - Add the Application Insights SDK to the web application.
   - Initialize the Application Insights SDK with the instrumentation key.

3. **Set up Azure Monitor alerts:**
   ```sh
   az monitor metrics alert create --name weather-yatri-alert --resource-group weather-yatri-rg --scopes <app-insights-resource-id> --condition "avg request duration > 1" --description "Alert when average request duration exceeds 1 second"
   ```

## Step 13: Clean Up Resources

1. **Delete the Resource Group to clean up all resources:**
   ```sh
   az group delete --name weather-yatri-rg --yes --no-wait
   ```

By following these steps, you can successfully set up the Weather Yatri application on Azure using the specified resource names. For any issues or further assistance, refer to the Azure documentation or contact support.
