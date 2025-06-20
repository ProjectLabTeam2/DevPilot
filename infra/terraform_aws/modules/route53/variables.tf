variable "domain_name" {
  description = "Nombre de dominio comprado (ej: devpilot.online)"
  type        = string
}

variable "alb_dns_name" {
  description = "Nombre DNS del Load Balancer"
  type        = string
}

variable "alb_zone_id" {
  description = "Hosted Zone ID del Load Balancer (provisto por AWS)"
  type        = string
}