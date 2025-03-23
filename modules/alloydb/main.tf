resource "google_compute_global_address" "private_ip_alloc" {
  name          = "alloydb-private-ip-range"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = "default"
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = "projects/${var.project_id}/global/networks/default"
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_alloc.name]
}

resource "google_alloydb_cluster" "athena_alloydb_cluster" {
  cluster_id = "${var.alloydb_cluster_name}-${formatdate("YYMMDDhhmmss", timestamp())}"
  location   = var.region
  
  network_config {
    network = "projects/${var.project_id}/global/networks/default"
  }

  # Set a unique ID to force recreation
  lifecycle {
    create_before_destroy = true
  }

  depends_on = [google_service_networking_connection.private_vpc_connection]
}

resource "google_alloydb_instance" "athena_alloydb_instance" {
  instance_id   = var.alloydb_instance_name
  cluster       = google_alloydb_cluster.athena_alloydb_cluster.id
  instance_type = "PRIMARY"
  
  machine_config {
    cpu_count = 2
  }

  depends_on = [google_alloydb_cluster.athena_alloydb_cluster]
}
