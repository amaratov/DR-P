module "ec2" {
  source = "./ec2"

  buildEnv     = var.buildEnv
  zoneChoice   = var.zoneChoice
  zoneChoice2     = var.zoneChoice2
  instanceType = "t2.micro"
  key_name     = "id_rsa_dr"
  allowIp      = "0.0.0.0/0"
}

# module "route53" {
#     source = "./route53"

#     buildEnv = "${var.buildEnv}"
#     routeName = "dev-pdxmodeler.propanestudio.com"
# }

module "iam" {
  source = "./iam"

  buildEnv = var.buildEnv
}

module "s3" {
  source = "./s3"

  buildEnv    = var.buildEnv
  grantUserId = module.iam.iam_user_id
}

module "rds" {
  source = "./rds"

  buildEnv       = var.buildEnv
  dbInstanceType = var.dbInstanceType
  dbUsername     = var.dbUsername
  dbPassword     = var.dbPassword
  subnetIds      = ["${module.ec2.subnet_id}", "${module.ec2.subnet_id2}"]
  zoneChoice     = var.zoneChoice
}

module "cloudtrail" {
  source = "./cloudtrail"

  buildEnv = var.buildEnv
}

module "frontend-ecr" {
  source = "./ecr"

  build    = var.buildEnv == "dev" ? 1 : 0
  repoName = "pdx-modeler"
}

# module "backend-ecr" {
#     source = "./ecr"

#     build = var.buildEnv == "dev" ? 1 : 0
#     repoName = "pdx-modeler-api"
# }