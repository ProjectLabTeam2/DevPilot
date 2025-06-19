resource "aws_lb" "devpilot_alb" {
  name               = "devpilot-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.sg_web_id]
  subnets            = var.public_subnet_ids

  enable_deletion_protection = false

  tags = {
    Name = "DevPilot-ALB"
  }
}

resource "aws_lb_target_group" "devpilot_tg" {
  name     = "devpilot-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  tags = {
    Name = "DevPilot-TG"
  }
}

resource "aws_lb_target_group_attachment" "devpilot_tg_attachment" {
  target_group_arn = aws_lb_target_group.devpilot_tg.arn
  target_id        = var.instance_id
  port             = 80
}

resource "aws_lb_listener" "http_redirect" {
  load_balancer_arn = aws_lb.devpilot_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.devpilot_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.acm_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.devpilot_tg.arn
  }
}