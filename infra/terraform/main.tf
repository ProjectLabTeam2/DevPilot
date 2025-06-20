module "networking" {
  source               = "./modules/networking"
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidr   = var.public_subnet_cidr
  private_subnet_cidr  = var.private_subnet_cidr
  my_office_ip         = var.my_office_ip
}

module "ec2" {
  source            = "./modules/ec2"
  key_name          = var.key_name
  public_subnet_id  = module.networking.public_subnet_ids[0]
  security_group_id = module.networking.sg_web_id
}

module "rds" {
  source             = "./modules/rds"
  private_subnet_ids = module.networking.private_subnet_ids
  security_group_id  = module.networking.sg_db_id
  db_user_param      = "/DevPilot/DB_USER_johnki"
  db_pass_param      = "/DevPilot/DB_PASSWORD_johnki"
}

module "alb" {
  source               = "./modules/alb"
  vpc_id               = module.networking.vpc_id
  public_subnet_ids    = module.networking.public_subnet_ids
  sg_web_id            = module.networking.sg_web_id
  acm_certificate_arn  = var.acm_certificate_arn
  instance_id          = module.ec2.app_instance_id
  alb_logs_bucket_name = module.logs.alb_logs_bucket_name
}

module "route53" {
  source         = "./modules/route53"
  domain_name    = "devpilot.online"
  alb_dns_name   = module.alb.alb_dns_name
  alb_zone_id    = module.alb.alb_zone_id
}

module "logs" {
  source                = "./modules/logs"
  alb_logs_bucket_name  = var.alb_logs_bucket_name
}

module "monitoring" {
  source      = "./modules/monitoring"
  instance_id = var.instance_id
}

resource "aws_cloudwatch_log_group" "nginx" {
  name = "/aws/ec2/nginx"
}

resource "aws_cloudwatch_log_group" "gunicorn" {
  name = "/aws/ec2/gunicorn"
}

module "splunk_lambda" {
  source          = "./modules/splunk_lambda"
  lambda_name     = "devpilot-splunk-logger"
  log_group_names = [
    aws_cloudwatch_log_group.nginx.name,
    aws_cloudwatch_log_group.gunicorn.name
  ]
  hec_url         = var.splunk_hec_url
  hec_token       = var.splunk_hec_token
}