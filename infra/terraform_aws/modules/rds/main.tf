data "aws_ssm_parameter" "db_user" {
  name            = var.db_user_param
  with_decryption = false
}

data "aws_ssm_parameter" "db_pass" {
  name            = var.db_pass_param
  with_decryption = true
}

resource "aws_db_subnet_group" "this" {
  name       = "devpilot-db-subnet-group"
  subnet_ids = var.private_subnet_ids
}

resource "aws_db_instance" "this" {
  identifier             = "devpilot-db"
  engine                 = "postgres"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  db_name                = "devpilotdb"
  username               = data.aws_ssm_parameter.db_user.value
  password               = data.aws_ssm_parameter.db_pass.value
  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [var.security_group_id]
  skip_final_snapshot    = true
  publicly_accessible    = false

  tags = { Name = "DevPilot-RDS" }
}

output "endpoint" {
  value = aws_db_instance.this.endpoint
}
