output "athena_alloydb_cluster" {
  description = "The AlloyDB cluster resource"
  value       = google_alloydb_cluster.athena_alloydb_cluster
}

output "athena_alloydb_instance" {
  description = "The AlloyDB instance resource"
  value       = google_alloydb_instance.athena_alloydb_instance
}

output "private_ip_address" {
  description = "The private IP address allocated for AlloyDB"
  value       = google_compute_global_address.private_ip_alloc.address
}

output "cluster_state" {
  description = "The current state of the AlloyDB cluster"
  value       = google_alloydb_cluster.athena_alloydb_cluster.state
}

output "instance_state" {
  description = "The current state of the AlloyDB instance"
  value       = google_alloydb_instance.athena_alloydb_instance.state
}

output "connection_string" {
  description = "Connection string for the AlloyDB instance"
  value       = "${google_alloydb_instance.athena_alloydb_instance.ip_address}:5432"
}
