provider "aws" {
  alias  = "primary"
  region = "ap-northeast-1"
}

data "aws_security_group" "smartnews" {
  name = "smartnews"
}

data "aws_vpc" "news" {
  provider = aws.primary
  filter {
    name   = "tag:Name"
    values = ["news"]
  }
}

data "aws_subnet" "news_private_d_0" {
  provider = aws.primary
  filter {
    name   = "tag:Name"
    values = ["news-private-d-0"]
  }
}

data "aws_subnet" "news_private_c_0" {
  provider = aws.primary
  filter {
    name   = "tag:Name"
    values = ["news-private-c-0"]
  }
}

data "aws_subnet" "news_private_b_0" {
  provider = aws.primary
  filter {
    name   = "tag:Name"
    values = ["news-private-b-0"]
  }
}