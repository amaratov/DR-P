variable "buildEnv" {
  type    = string
  default = "dev"
}

variable "grantUserId" {
  type = string
}

data "aws_canonical_user_id" "current" {}

resource "aws_s3_bucket" "pdx-modeler-bucket" {
  bucket = "pdx-modeler-bucket-${var.buildEnv}"

  tags = {
    Name        = "pdx-modeler-bucket-${var.buildEnv}"
    Environment = "${var.buildEnv}"
  }
}

resource "aws_s3_bucket_acl" "pdx_private" {
  bucket = aws_s3_bucket.pdx-modeler-bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_policy" "allow_access_from_pdx_user" {
  bucket = aws_s3_bucket.pdx-modeler-bucket.id
  policy = data.aws_iam_policy_document.allow_access_from_pdx_user.json
}

data "aws_iam_policy_document" "allow_access_from_pdx_user" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["${var.grantUserId}"]
    }

    actions = [
      "s3:GetObject",
      "s3:ListBucket",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:PutObjectTagging",
    ]

    resources = [
      aws_s3_bucket.pdx-modeler-bucket.arn,
      "${aws_s3_bucket.pdx-modeler-bucket.arn}/*",
    ]
  }

  statement {
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
    
    effect = "Allow"
    
    actions = [
      "s3:GetObject",
      "s3:GetObjectVersion",
    ]

    resources = [
      aws_s3_bucket.pdx-modeler-bucket.arn,
      "${aws_s3_bucket.pdx-modeler-bucket.arn}/*",
    ]

    condition {
      test     = "StringEquals"
      variable = "s3:ExistingObjectTag/icon"

      values = [
        "true",
      ]
    }

  }
}

data "aws_iam_policy_document" "allow_public_access_to_icon_tag" {
  
}