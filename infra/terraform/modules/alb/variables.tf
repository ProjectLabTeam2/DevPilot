variable "vpc_id" {
  description = "ID de la VPC"
  type        = string
}

variable "public_subnet_ids" {
  description = "Lista de subnets públicas"
  type        = list(string)
}

variable "sg_web_id" {
  description = "ID del Security Group del backend"
  type        = string
}

variable "acm_certificate_arn" {
  description = "ARN del certificado SSL en ACM"
  type        = string
}

variable "instance_id" {
  description = "ID de la instancia EC2 del backend"
  type        = string
}

variable "alb_logs_bucket_name" {
  type = string
}
