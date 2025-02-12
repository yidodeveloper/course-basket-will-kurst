terraform {
  backend "s3" {
    bucket         = "course-basket-will-kurst-infra-tfstate"
    key            = "workspace/backend-s3/terraform.tfstate"
    region         = "ap-northeast-2"
    encrypt        = true
    dynamodb_table = "terraform-lock-for-course-basket-will-kurst"
  }
}