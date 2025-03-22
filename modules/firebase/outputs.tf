output "firebase_project" {
  description = "The Firebase project resource"
  value       = google_firebase_project.default
}

output "project_id" {
  description = "The Firebase project ID"
  value       = google_firebase_project.default.project
}