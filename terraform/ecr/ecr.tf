variable "repoName" {
  type    = string
  default = "repoName"
}

variable "build" {
  type    = number
  default = 0
}

resource "aws_ecr_repository" "pdx-ecr-repo" {
  name                 = var.repoName
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }

  count = var.build
}