#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
else
  echo "Error: .env file not found!"
  exit 1
fi

echo "Creating temporary OpenAPI spec with environment variables..."

# Create a temporary OpenAPI file with the real values substituted
cat openapi.yaml | \
  sed "s|\${CLOUDSTORE_SERVICE_URL}|$CLOUDSTORE_SERVICE_URL|g" | \
  sed "s|\${VERTEXAI_SERVICE_URL}|$VERTEXAI_SERVICE_URL|g" | \
  sed "s|\${API_GATEWAY_HOST}|$API_GATEWAY_HOST|g" > openapi_temp.yaml

# Display the URLs being used (for debugging)
echo "Using the following service URLs:"
echo "CLOUDSTORE_SERVICE_URL: $CLOUDSTORE_SERVICE_URL"
echo "VERTEXAI_SERVICE_URL: $VERTEXAI_SERVICE_URL"
echo "API_GATEWAY_HOST: $API_GATEWAY_HOST"

# Generate a unique config name with timestamp
CONFIG_NAME="athena-api-config-$(date +%Y%m%d%H%M%S)"
echo "Using config name: $CONFIG_NAME"

# Create the new API config
echo "Creating new API Gateway config..."
gcloud api-gateway api-configs create $CONFIG_NAME \
  --api=$API_NAME \
  --openapi-spec=openapi_temp.yaml \
  --project=$PROJECT_ID

if [ $? -ne 0 ]; then
  echo "Error creating API config!"
  echo "Check the errors above and try again."
  # Keep the temp file for debugging
  echo "Temporary file kept for debugging: openapi_temp.yaml"
  exit 1
fi

# Update the gateway to use the new config
echo "Updating API Gateway..."
gcloud api-gateway gateways update $GATEWAY_NAME \
  --api=$API_NAME \
  --api-config=$CONFIG_NAME \
  --location=$LOCATION \
  --project=$PROJECT_ID

if [ $? -ne 0 ]; then
  echo "Error updating API Gateway!"
  # Keep the temp file for debugging
  echo "Temporary file kept for debugging: openapi_temp.yaml"
  exit 1
fi

# Remove the temporary file
rm openapi_temp.yaml
echo "Temporary OpenAPI spec removed."

echo "API Gateway deployment completed successfully!"
echo "Config: $CONFIG_NAME"
echo "Gateway: $GATEWAY_NAME"
echo "Location: $LOCATION"