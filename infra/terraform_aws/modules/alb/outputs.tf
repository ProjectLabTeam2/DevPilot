output "alb_dns_name" {
  value       = aws_lb.devpilot_alb.dns_name
  description = "Nombre DNS del Load Balancer"
}

output "alb_zone_id" {
  value       = aws_lb.devpilot_alb.zone_id
  description = "Zone ID del Load Balancer para usar en Route53"
}
