resource "aws_instance" "app" {
  ami                         = "ami-084568db4383264d4" 
  instance_type               = "t2.micro"
  key_name                    = var.key_name
  subnet_id                   = var.public_subnet_id
  vpc_security_group_ids      = [var.security_group_id]
  associate_public_ip_address = true

  tags = { Name = "DevPilot-App-EC2" }
}

output "public_ip" {
  value = aws_instance.app.public_ip
}
