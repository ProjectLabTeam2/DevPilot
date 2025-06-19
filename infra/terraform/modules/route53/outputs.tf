output "zone_id" {
  value       = aws_route53_zone.primary.zone_id
  description = "ID de la zona hospedada en Route53"
}