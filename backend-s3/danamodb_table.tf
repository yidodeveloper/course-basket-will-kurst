resource "aws_dynamodb_table" "dynamodb" {
  name         = "terraform-lock-for-course-basket-will-kurst"
  hash_key     = "LockID"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "LockID"
    type = "S"
  }
}