output "athena_vertex_workbench" {
  description = "The Vertex AI Notebook instance"
  value       = google_notebooks_instance.athena_vertex_workbench
}

output "model_artifacts" {
  description = "The storage bucket for model artifacts"
  value       = google_storage_bucket.model_artifacts
}

output "vertex_service_account" {
  description = "The service account for Vertex AI operations"
  value       = google_service_account.vertex_service_account
}

output "notebook_url" {
  description = "The URL of the Vertex AI Notebook instance"
  value       = google_notebooks_instance.athena_vertex_workbench.proxy_uri
}

output "notebook_instance_id" {
  description = "The ID of the Vertex AI Notebook instance"
  value       = google_notebooks_instance.athena_vertex_workbench.id
}

output "model_artifacts_bucket_url" {
  description = "The URL of the model artifacts bucket"
  value       = google_storage_bucket.model_artifacts.url
}