terraform {
  backend "s3" {
    bucket         = "devpilot-terraform-state-johnki-20250527"
    key            = "devpilot/infra/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "devpilot-terraform-locks-johnki-20250527"
  }
}
