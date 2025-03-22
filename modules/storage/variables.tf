variable "create_function_bucket" {
  description = "Flag to determine whether to create a function bucket"
  type        = bool
  default     = false
}

variable "region" {
  description = "The region to deploy resources to"
  type        = string
}

variable "project_id" {
  description = "The Google Cloud project ID"
  type        = string
}

variable "bucket_name" {
  description = "The name of the bucket to create"
  type        = string
}