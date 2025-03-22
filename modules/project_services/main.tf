resource "google_project_service" "services" {
  for_each = toset([
    "serviceusage.googleapis.com",
    "firebase.googleapis.com",
    "firestore.googleapis.com",
    "firebaserules.googleapis.com",
    "alloydb.googleapis.com",
    "apigateway.googleapis.com",
    "aiplatform.googleapis.com",
    "notebooks.googleapis.com",
    "containerregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "iam.googleapis.com",
    "servicenetworking.googleapis.com"
  ])

  service            = each.key
  disable_on_destroy = false
}
