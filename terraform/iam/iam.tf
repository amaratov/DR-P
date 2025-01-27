variable "buildEnv" {
  type    = string
  default = "dev"
}

resource "aws_iam_user" "pdx" {
  name = "pdx-user-${var.buildEnv}"
  path = "/system/"

  tags = {
    env = "${var.buildEnv}"
  }
}

resource "aws_iam_access_key" "pdx" {
  user = aws_iam_user.pdx.name
}

output "iam_user_id" {
  value = aws_iam_user.pdx.unique_id
}

output "iam_user_name" {
  value = aws_iam_user.pdx.name
}
