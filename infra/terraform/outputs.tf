
output "rds_endpoint" {
  description = "Endpoint de la RDS PostgreSQL"
  value       = module.rds.endpoint
}
