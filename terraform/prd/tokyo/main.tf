terraform {
  backend "s3" {
    region = "ap-northeast-1"
    bucket = "terraform-remote-state-smartnews-prd-ap-northeast-1"
    key    = "realtime-streaming/realtime-streaming-llm-ops.tfstate"
  }
}
