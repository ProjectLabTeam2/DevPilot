variable "project" {
  default = "jenkins-devpilot"
}

variable "region" {
  default = "us-central1"
}

variable "zone" {
  default = "us-central1-a"
}

variable "ssh_source_ranges" {
  type        = list(string)
  default     = ["181.128.89.61/32" , "181.142.123.92/32" , "179.1.224.10/32"]
  description = "IP addresses allowed to connect via SSH."
}