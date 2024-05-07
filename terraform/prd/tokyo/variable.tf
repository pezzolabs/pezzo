variable "cost" {
  default     = "smartnews"
  description = "The organization name"
}

variable "team" {
  default     = "Infrastructure and Tooling - SH"
  description = "The team name"
}

variable "region" {
  default     = "ap-northeast-1"
  description = "The region code for the aws region, e.g. ap-northeast-1 or us-west-2"
}

variable "owner" {
  default     = "tao.xiao@smartnews.com"
  description = "The maintainer and point of contact for this component"
}

variable "system" {
  default = "realtime-streaming"
}

variable "service" {
  default = "realtime-streaming"
}

variable "aws_account_id" {
  default = "165463520094"
}