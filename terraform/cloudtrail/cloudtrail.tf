variable "buildEnv" {
  type    = string
  default = "dev"
}

data "aws_caller_identity" "current" {}

resource "aws_cloudtrail" "cloudtrail" {
  name                          = "pdx-cloudtrail-${var.buildEnv}"
  s3_bucket_name                = aws_s3_bucket.cloudtrailBucket.id
  s3_key_prefix                 = "prefix"
  include_global_service_events = true
  tags = {
    Name        = "pdx-modeler-cloudtrail"
    Environment = "${var.buildEnv}"
  }
}

resource "aws_s3_bucket" "cloudtrailBucket" {
  bucket        = "cloudtrail-bucket-${var.buildEnv}"
  force_destroy = true
  tags = {
    Name        = "pdx-modeler-cloidtrail-bucket"
    Environment = "${var.buildEnv}"
  }
}

resource "aws_s3_bucket_acl" "cloudtrail_private" {
  bucket = aws_s3_bucket.cloudtrailBucket.id
  acl    = "private"
}

resource "aws_s3_bucket_policy" "policy" {
  bucket = aws_s3_bucket.cloudtrailBucket.id
  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AWSCloudTrailAclCheck",
            "Effect": "Allow",
            "Principal": {
              "Service": "cloudtrail.amazonaws.com"
            },
            "Action": "s3:GetBucketAcl",
            "Resource": "${aws_s3_bucket.cloudtrailBucket.arn}"
        },
        {
            "Sid": "AWSCloudTrailWrite",
            "Effect": "Allow",
            "Principal": {
              "Service": "cloudtrail.amazonaws.com"
            },
            "Action": "s3:PutObject",
            "Resource": "${aws_s3_bucket.cloudtrailBucket.arn}/prefix/AWSLogs/${data.aws_caller_identity.current.id}/*",
            "Condition": {
                "StringEquals": {
                    "s3:x-amz-acl": "bucket-owner-full-control"
                }
            }
        }
    ]
}
POLICY
}