terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 4.0"
    }
  }
}

# Configure the provider not to use the specified project for quota check.
provider "google-beta" {
  alias                 = "no_user_project_override"
  user_project_override = false
}

# Configure the provider that uses the new project's quota.
provider "google-beta" {
  user_project_override = true
}

# Use the existing GCP project
variable "project_id" {
  default = "genai-genesis-454423"
}

# Enable required GCP & Firebase APIs
resource "google_project_service" "services" {
  provider = google-beta.no_user_project_override
  project  = var.project_id

  for_each = toset([
    "serviceusage.googleapis.com",
    "firebase.googleapis.com",
    "firestore.googleapis.com",
    "firebaserules.googleapis.com",
    "alloydb.googleapis.com",
    "apigateway.googleapis.com"
  ])

  service             = each.key
  disable_on_destroy = false
}

# Enable Firebase for the existing project
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.project_id

  depends_on = [google_project_service.services]
}

# Create Gateway API
resource "google_api_gateway_api" "my_api" {
  provider  = google-beta
  api_id    = "athena-api"
  project   = var.project_id
}

# Create API Config
resource "google_api_gateway_api_config" "my_config" {
  provider      = google-beta
  api           = google_api_gateway_api.my_api.api_id
  api_config_id = "my-api-config"
  project       = var.project_id
  
  openapi_documents {
    document {
      path     = "openapi.yaml"
      contents = filebase64("openapi.yaml")
    }
  }
  
  lifecycle {
    create_before_destroy = true
  }
  
  depends_on = [google_api_gateway_api.my_api]
}

# Create Gateway
resource "google_api_gateway_gateway" "my_gateway" {
  provider   = google-beta
  gateway_id = "athena-gateway"
  api_config = google_api_gateway_api_config.my_config.id  # Changed from api to api_config
  project    = var.project_id
  region     = "us-central1"
  
  depends_on = [google_api_gateway_api_config.my_config]
}

# Create new storage bucket in the US
# location with Standard Storage
resource "google_storage_bucket" "static" {
 name          = "genai-static-449"
 location      = "US"
 storage_class = "STANDARD"
 project  = var.project_id

 uniform_bucket_level_access = true
}

# Create a new AlloyDB cluster
resource "google_alloydb_cluster" "my_alloydb_cluster" {
  provider     = google-beta
  cluster_id   = "athena-alloydb-cluster"
  location     = "us-central1"
  project      = var.project_id

  network_config {
    network = "projects/${var.project_id}/global/networks/default"
  }

  initial_user {
    password = "YourSecurePassword123!" # Consider using a secret manager
  }
}

# Create a new AlloyDB instance
resource "google_alloydb_instance" "my_alloydb_instance" {
  instance_id   = "athena-alloydb-instance"
  cluster       = google_alloydb_cluster.my_alloydb_cluster.id
  instance_type = "PRIMARY"
  machine_config {
    cpu_count = 2
  }
  
  depends_on = [google_alloydb_cluster.my_alloydb_cluster]
}

