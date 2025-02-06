# resource "aws_route53_zone" "main" {
#   name = var.domain_name
# }

# resource "aws_route53_record" "cert" {
#   for_each = {
#     for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
#       name   = dvo.resource_record_name
#       record = dvo.resource_record_value
#       type   = dvo.resource_record_type
#     }
#   }

#   allow_overwrite = true
#   name            = each.value.name
#   records         = [each.value.record]
#   ttl             = 60
#   type            = each.value.type
#   zone_id         = aws_route53_zone.main.zone_id
# }

# resource "aws_route53_record" "main-a" {
#   zone_id = aws_route53_zone.main.zone_id
#   name    = var.s3_name
#   type    = "A"

#   alias {
#     name                   = "s3-website.ap-northeast-2.amazonaws.com."
#     zone_id                = aws_s3_bucket.main.hosted_zone_id
#     evaluate_target_health = true
#   }
# }
