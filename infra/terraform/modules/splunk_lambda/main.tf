resource "aws_lambda_function" "splunk_forwarder" {
  function_name = var.lambda_name
  runtime       = "python3.9"
  handler       = "lambda_function.lambda_handler"
  role          = aws_iam_role.lambda_role.arn
  filename      = "${path.module}/lambda.zip"
  timeout       = 60
  memory_size   = 128

  environment {
    variables = {
      HEC_URL   = var.hec_url
      HEC_TOKEN = var.hec_token
    }
  }
}

resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.splunk_forwarder.arn
  principal     = "logs.${data.aws_region.current.name}.amazonaws.com"
}

data "aws_region" "current" {}

resource "aws_cloudwatch_log_subscription_filter" "from_groups" {
  count              = length(var.log_group_names)
  name               = "${var.lambda_name}-${count.index}"
  log_group_name     = var.log_group_names[count.index]
  filter_pattern     = ""
  destination_arn    = aws_lambda_function.splunk_forwarder.arn
  distribution       = "ByLogStream"
  depends_on         = [aws_lambda_permission.allow_cloudwatch]
}