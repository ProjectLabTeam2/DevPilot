output "rds_endpoint" {
  description = "Endpoint de la RDS PostgreSQL"
  value       = module.rds.endpoint
}

output "alb_dns_name" {
  value       = module.alb.alb_dns_name
  description = "DNS del Load Balancer"
}