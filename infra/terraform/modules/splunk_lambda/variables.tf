variable "lambda_name" {
  type = string
}

variable "log_group_names" {
  type = list(string)
}

variable "hec_url" {
  type = string
  description = "Splunk HEC URL"
  sensitive   = true
}

variable "hec_token" {
  type = string
  description = "Splunk HEC Token"
  sensitive   = true
}