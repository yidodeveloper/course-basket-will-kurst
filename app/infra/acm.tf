resource "aws_acm_certificate" "main" {
  provider          = aws.virginia
  domain_name       = var.domain_name
  validation_method = "DNS"

  tags = {
    Name        = var.domain_name
    Environment = "prod"
  }
}
