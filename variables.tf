variable "gcp_credentials" {
  type        = string
  sensitive   = true
  description = "Google Cloud service account credentials"
}

variable "project_id" {
  default = "genai-genesis-454423"
}

variable "region" {
  default = "us-central1"
}

variable "bucket_name" {
  default = "genai-static-449"
}

variable "storage_bucket_name" {
  description = "Name for the main storage bucket"
  type        = string
  default     = "athena-storage-bucket"
}

variable "alloydb_cluster_name" {
  description = "Name for the AlloyDB cluster"
  type        = string
  default     = "athena-db-cluster"
}

variable "alloydb_instance_name" {
  description = "Name for the AlloyDB instance"
  type        = string
  default     = "athena-db-instance"
}

variable "api_gateway_name" {
  description = "Name for the API Gateway"
  type        = string
  default     = "athena-api"
}