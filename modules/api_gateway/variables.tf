variable "project_id" {
  description = "The Google Cloud project ID"
  type        = string
}

variable "region" {
  description = "The region to deploy the API Gateway"
  type        = string
  default     = "us-central1"
}

variable "api_id" {
  description = "ID for the API Gateway API"
  type        = string
  default     = "athena-api"
}

variable "gateway_id" {
  description = "ID for the API Gateway Gateway"
  type        = string
  default     = "athena-gateway"
}

variable "openapi_file_path" {
  description = "Path to the OpenAPI specification file"
  type        = string
  default     = "openapi.yaml"
}