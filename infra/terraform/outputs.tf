output "app_ec2_ip" {
  description = "IP pública de la EC2 (app + frontend)"
  value       = module.ec2.public_ip
}

output "rds_endpoint" {
  description = "Endpoint de la RDS PostgreSQL"
  value       = module.rds.endpoint
}
