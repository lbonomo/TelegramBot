# Terrarorm
terraform {
  required_version = ">= 0.12"
  required_providers {
    aws = {
      version = ">= 2.7.0"
      source  = "hashicorp/aws"
    }
  }
}

# Provider
provider "aws" {
  region  = "us-east-1"
  profile = "terraform"
}

resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name         = "TelegramUsers"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userID"

  attribute {
    type = "N"
    name = "userID"
  }

}

resource "aws_dynamodb_table" "telegram_message" {
  name         = "TelegramMessages"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "message_id"
  range_key    = "user_id"

  attribute {
    type = "N"
    name = "message_id"
  }
  
  attribute {
    type = "N"
    name = "user_id"
  }

}
