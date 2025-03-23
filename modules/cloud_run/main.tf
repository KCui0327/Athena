variable "services" {
  type = map(object({
    name  = string
    image = string
  }))
  default = {
    alloydb = {
      name  = "alloydb"
      image = "us-central1-docker.pkg.dev/genai-genesis-454423/docker-repo/alloydb-service:1.0"
    }
    vertexai = {
      name  = "vertexai"
      image = "us-central1-docker.pkg.dev/genai-genesis-454423/docker-repo/vertexai-service:1.0"
    }
    cloudstore = {
      name  = "cloudstore"
      image = "us-central1-docker.pkg.dev/genai-genesis-454423/docker-repo/cloudstore-service:1.0"
    }
  }
}

resource "google_cloud_run_service" "run_service" {
  for_each = var.services
  
  name = each.value.name
  location = var.region
  
  template {
    spec {
      containers {
        image = each.value.image

        args = []
        ports {
          container_port = 8000
        }

        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
    
    metadata {
      annotations = {
        "run.googleapis.com/cpu-throttling" = "true"
        "autoscaling.knative.dev/maxScale"  = "10"
        "run.googleapis.com/execution-environment" = "gen1"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

}