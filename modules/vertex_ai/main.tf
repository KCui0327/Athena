resource "google_notebooks_instance" "athena_vertex_workbench" {
  name         = "athena-vertex-workbench"
  location     = "${var.region}-a"
  machine_type = "n1-standard-4"
  
  vm_image {
    project      = "deeplearning-platform-release"
    image_family = "tf-ent-2-9-cu113-notebooks"
  }
}

resource "google_storage_bucket" "model_artifacts" {
  name          = "athena-model-artifacts"
  location      = var.region
  storage_class = "STANDARD"
  
  uniform_bucket_level_access = true
}

resource "google_service_account" "vertex_service_account" {
  account_id   = "vertex-ai-service-account"
  display_name = "Vertex AI Service Account"
}

resource "google_project_iam_member" "vertex_ai_admin" {
  project = var.project_id
  role    = "roles/aiplatform.admin"
  member  = "serviceAccount:${google_service_account.vertex_service_account.email}"
}

resource "google_project_iam_member" "storage_admin" {
  project = var.project_id
  role   = "roles/storage.admin"
  member = "serviceAccount:${google_service_account.vertex_service_account.email}"
}
