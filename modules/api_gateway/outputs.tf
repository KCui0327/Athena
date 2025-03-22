output "athena_gateway" {
  description = "The API Gateway gateway resource"
  value       = google_api_gateway_gateway.athena_gateway
}

output "athena_api" {
  description = "The API Gateway API resource"
  value       = google_api_gateway_api.athena_api
}

output "athena_api_config" {
  description = "The API Gateway API config resource"
  value       = google_api_gateway_api_config.athena_api_config
}