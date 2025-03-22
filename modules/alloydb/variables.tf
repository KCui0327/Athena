variable "project_id" {
  default = "genai-genesis-454423"
}

variable "region" {
  default = "us-central1"
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