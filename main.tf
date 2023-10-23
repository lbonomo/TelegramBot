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
  hash_key     = "chatID"
  range_key    = "username"

  attribute {
    name = "chatID"
    type = "N"
  }

  attribute {
    name = "username"
    type = "S"
  }

#   attribute {
#     name = "userID"
#     type = "S"
#   }


#   attribute {
#     name = "first_name"
#     type = "S"
#   }

#   attribute {
#     name = "last_name"
#     type = "S"
#   }

}
