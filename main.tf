# Main file focuses only on module calls and their dependencies
module "project_services" {
  source = "./modules/project_services"
}

module "firebase" {
  source     = "./modules/firebase"
  project_id = var.project_id
  depends_on = [module.project_services]
}

module "api_gateway" {
  source     = "./modules/api_gateway"
  project_id = var.project_id
  region     = var.region
  api_id     = var.api_gateway_name
  depends_on = [module.project_services]
}

module "storage" {
  source     = "./modules/storage"
  project_id = var.project_id
  region     = var.region
  bucket_name = var.storage_bucket_name
  depends_on = [module.project_services]
}

module "alloydb" {
  source     = "./modules/alloydb"
  project_id = var.project_id
  region     = var.region
  alloydb_cluster_name = var.alloydb_cluster_name
  alloydb_instance_name = var.alloydb_instance_name
  depends_on = [module.project_services]
}

module "vertex_ai" {
  source     = "./modules/vertex_ai"
  project_id = var.project_id
  region     = var.region
  depends_on = [module.project_services]
}

module "functions" {
  source     = "./modules/functions"
  project_id = var.project_id
  region     = var.region
  depends_on = [module.project_services, module.storage]
}