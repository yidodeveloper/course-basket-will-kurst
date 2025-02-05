resource "aws_route53_zone" "main" {
  name = var.s3_name
}

resource "aws_route53_record" "main" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.s3_name
  type    = "A"

  alias {
    name                   = aws_s3_bucket.main.bucket_domain_name
    zone_id                = aws_s3_bucket.main.hosted_zone_id
    evaluate_target_health = true
  }
}
