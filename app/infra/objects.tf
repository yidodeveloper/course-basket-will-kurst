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

resource "aws_s3_object" "result_html" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/source-code/html/result.html"
  source       = "../source-code/html/result.html"
  content_type = "text/html"
}

resource "aws_s3_object" "index_css" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/source-code/css/index.css"
  source       = "../source-code/css/index.css"
  content_type = "text/css"
}

resource "aws_s3_object" "home_css" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/source-code/css/home.css"
  source       = "../source-code/css/home.css"
  content_type = "text/css"
}

resource "aws_s3_object" "result_css" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/source-code/css/result.css"
  source       = "../source-code/css/result.css"
  content_type = "text/css"
}

resource "aws_s3_object" "lecture_js" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/source-code/js/lecture.js"
  source       = "../source-code/js/lecture.js"
  content_type = "text/javascript"
}

resource "aws_s3_object" "calculator_js" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/source-code/js/calculator.js"
  source       = "../source-code/js/calculator.js"
  content_type = "text/javascript"
}

resource "aws_s3_object" "header_png" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/media/header.png"
  source       = "../media/header.png"
  content_type = "media/png"
}

resource "aws_s3_object" "recommend_png" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/media/recommend.png"
  source       = "../media/recommend.png"
  content_type = "media/png"
}

resource "aws_s3_object" "retry_button_png" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/media/retry-button.png"
  source       = "../media/retry-button.png"
  content_type = "media/png"
}

resource "aws_s3_object" "start_button_png" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/media/start-button.png"
  source       = "../media/start-button.png"
  content_type = "media/png"
}

resource "aws_s3_object" "submit_button_png" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/media/submit-button.png"
  source       = "../media/submit-button.png"
  content_type = "media/png"
}

resource "aws_s3_object" "thumbnail_png" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/media/thumbnail.png"
  source       = "../media/thumbnail.png"
  content_type = "media/png"
}

resource "aws_s3_object" "data_24_1_json" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/data/24-1.json"
  source       = "../data/24-1.json"
  content_type = "Application/json"
}

resource "aws_s3_object" "data_24_2_json" {
  bucket       = aws_s3_bucket.main.id
  key          = "app/data/24-2.json"
  source       = "../data/24-2.json"
  content_type = "Application/json"
}
