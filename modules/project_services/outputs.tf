output "enabled_services" {
  description = "Map of the enabled Google Cloud services"
  value       = google_project_service.services
}

output "service_names" {
  description = "List of the enabled Google Cloud service names"
  value       = [for s in google_project_service.services : s.service]
}