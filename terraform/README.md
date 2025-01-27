# Terraform

This repository is used to spin up the cloud infrastructure that is involved in deploying the application. It supports building dev/test/prod in the same client if need be

## Included Components
CloudTrail
EC2
ECR x2
RDS (Postgres)
Route 53
S3
IAM

## Instructions
Before you plan or apply you'll need to connect to your remote state do this by creating config.s3.tfbackend (a quickstart exists as config.s3.tfbackend.example) and replace the values as appropriate. Then you can run `terraform init -backend-config=./config.s3.tfbackend`
create terraform.tfvars (a quickstart version exists in terraform.tfvars.example) and insert the variables you need to override from variables.tf in the form of var = value
then run `terraform plan` in this directory to see what it plans to do or `terraform apply` to see and potentially action the changes.

## User permissions
The user that runs terraform will need at least read/write/create on the components it is supposed to manage, ideally it has full access on delete as well. As a best practice you should use an individual user that is only used for terraform