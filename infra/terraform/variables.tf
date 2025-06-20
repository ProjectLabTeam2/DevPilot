variable "region" {
  description = "Región AWS"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR de la VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR de la subred pública"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "CIDR de la subred privada"
  type        = string
  default     = "10.0.2.0/24"
}

variable "key_name" {
  description = "Nombre de la key pair para SSH"
  type        = string
  default     = "dev-pilot-key"
}

variable "my_office_ip" {
  description = "Tu IP pública/CIDR para SSH"
  type        = string
}

variable "acm_certificate_arn" {
  description = "ARN del certificado emitido por ACM para HTTPS"
  type        = string
}

variable "domain_name" {
  description = "Nombre del dominio principal"
  type        = string
  default     = "devpilot.online"
}

variable "alb_logs_bucket_name" {
  type        = string
  description = "Nombre del bucket para los logs del ALB"
}

variable "instance_id" {
  type        = string
  description = "ID de la instancia EC2 para la alarma de CPU"
}

variable "splunk_hec_url" {
  type        = string
  description = "URL del endpoint HEC de Splunk"
  sensitive   = true
}

variable "splunk_hec_token" {
  type        = string
  description = "Token HEC de autenticación para Splunk"
  sensitive   = true
}