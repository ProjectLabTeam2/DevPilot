resource "aws_s3_bucket" "tfstate" {
  bucket = "devpilot-terraform-state-johnki-20250527" 
  tags = {
    Name = "DevPilot-TFState"
  }
}

resource "aws_s3_bucket_versioning" "tfstate_versioning" {
  bucket = aws_s3_bucket.tfstate.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_dynamodb_table" "tf_locks" {
  name         = "devpilot-terraform-locks-johnki-20250527"  
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name = "DevPilot-TFLocks"
  }
}

resource "aws_ssm_parameter" "db_user" {
  name  = "/DevPilot/DB_USER_johnki"  
  type  = "String"
  value = "admin"
}

resource "aws_ssm_parameter" "db_password" {
  name  = "/DevPilot/DB_PASSWORD_johnki"  
  type  = "SecureString"
  value = "admin123"
}
