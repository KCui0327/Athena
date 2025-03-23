terraform {
  cloud {
    organization = "Athena_GenAI"
    workspaces { name = "Athena" }
  }

  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 4.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  credentials = file("${path.module}/gcp_credentials.json")
  project     = var.project_id
  region      = var.region
}

provider "google-beta" {
  credentials = file("${path.module}/gcp_credentials.json")
  project     = var.project_id
  region      = var.region
}

provider "google-beta" {
  alias                 = "no_user_project_override"
  user_project_override = false
  credentials           = file("${path.module}/gcp_credentials.json")
  project               = var.project_id
  region                = var.region
}