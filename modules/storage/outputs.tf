output "static" {
  description = "The static storage bucket resource"
  value       = google_storage_bucket.static
}

output "bucket_name" {
  description = "The name of the static storage bucket"
  value       = google_storage_bucket.static.name
}

output "bucket_url" {
  description = "The URL of the static storage bucket"
  value       = google_storage_bucket.static.url
}

output "bucket_self_link" {
  description = "The self link of the static storage bucket"
  value       = google_storage_bucket.static.self_link
}