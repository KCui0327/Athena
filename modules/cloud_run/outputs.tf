output "service_urls" {
  value = {
    for k, v in google_cloud_run_service.run_service : k => v.status[0].url
  }
  description = "URLs of deployed Cloud Run services"
}