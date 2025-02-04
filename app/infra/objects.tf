resource "aws_s3_object" "index_html" {
  bucket       = aws_s3_bucket.main.id
  key          = "index.html"
  source       = "../source-code/html/index.html"
  content_type = "text/html"
}

resource "aws_s3_object" "home_html" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/source-code/html/home.html"
  source       = "../source-code/html/home.html"
  content_type = "text/html"
}

resource "aws_s3_object" "style_css" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/source-code/css/style.css"
  source       = "../source-code/css/style.css"
  content_type = "text/css"
}

resource "aws_s3_object" "lecture_js" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/source-code/js/lecture.js"
  source       = "../source-code/js/lecture.js"
  content_type = "text/javascript"
}

resource "aws_s3_object" "cow_jpeg" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/media/cow.jpeg"
  source       = "../media/cow.jpeg"
  content_type = "media/jpeg"
}

resource "aws_s3_object" "data_24_2_json" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/data/24-2.json"
  source       = "../data/24-2.json"
  content_type = "Application/json"
}