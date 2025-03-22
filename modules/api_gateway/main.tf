resource "google_api_gateway_api" "athena_api" {
  provider = google-beta
  api_id   = var.api_id
  project  = var.project_id
}

resource "google_api_gateway_api_config" "athena_api_config" {
  provider      = google-beta
  api           = google_api_gateway_api.athena_api.api_id
  api_config_id = "my-api-config-${formatdate("YYYYMMDDhhmmss", timestamp())}"
  project       = var.project_id
  
  openapi_documents {
    document {
      path     = var.openapi_file_path
      contents = filebase64(var.openapi_file_path)
    }
  }
  
  lifecycle {
    create_before_destroy = true
  }
}

resource "google_api_gateway_gateway" "athena_gateway" {
  provider   = google-beta
  gateway_id = var.gateway_id
  api_config = google_api_gateway_api_config.athena_api_config.id
  region     = var.region
  project    = var.project_id
}