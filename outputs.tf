output "api_gateway_url" {
  description = "URL of the API Gateway"
  value       = module.api_gateway.athena_gateway.default_hostname
  depends_on  = [module.api_gateway]
}

output "storage_bucket_name" {
  description = "Name of the created storage bucket"
  value       = module.storage.static.name
  depends_on  = [module.storage]
}

output "alloydb_cluster_id" {
  description = "ID of the AlloyDB cluster"
  value       = module.alloydb.athena_alloydb_cluster.id
  depends_on  = [module.alloydb]
}

output "alloydb_instance_name" {
  description = "Name of the AlloyDB instance"
  value       = module.alloydb.athena_alloydb_instance.name
  depends_on  = [module.alloydb]
}

output "vertex_ai_notebook_name" {
  description = "Name of the Vertex AI Notebook instance"
  value       = module.vertex_ai.athena_vertex_workbench.name
  depends_on  = [module.vertex_ai]
}

output "model_artifacts_bucket" {
  description = "Name of the bucket for storing model artifacts"
  value       = module.vertex_ai.model_artifacts.name
  depends_on  = [module.vertex_ai]
}

output "vertex_ai_service_account" {
  description = "Email of the Vertex AI service account"
  value       = module.vertex_ai.vertex_service_account.email
  depends_on  = [module.vertex_ai]
}

output "cloud_run_service_urls" {
  description = "URLs of the Cloud Run services"
  value       = module.cloud_run.service_urls
  depends_on  = [module.cloud_run]
}
