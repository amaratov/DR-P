variable "buildEnv" {
  type    = string
  default = "dev"
}

variable "dbInstanceType" {
  type    = string
  default = "db.t3.micro"
}

variable "zoneChoice" {
  type    = string
  default = "us-west-2a"
}

variable "dbUsername" {
  type      = string
  sensitive = true
}

variable "dbPassword" {
  type      = string
  sensitive = true
}

variable "subnetIds" {
  type = list(any)
}

resource "aws_db_subnet_group" "pdx-modeler-db-subnet-group" {
  name       = "main"
  subnet_ids = var.subnetIds

  tags = {
    Name        = "pdx-modeler-db-subnet-group"
    Environment = "${var.buildEnv}"
  }
}


resource "aws_db_instance" "pdx-modeler-db" {
  allocated_storage               = 10
  availability_zone               = var.zoneChoice
  skip_final_snapshot             = true
  identifier                      = "pdx-modeler-db-${var.buildEnv}"
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  engine                          = "postgres"
  engine_version                  = "14"
  instance_class                  = var.dbInstanceType
  username                        = var.dbUsername
  password                        = var.dbPassword
  backup_retention_period         = 30
  db_name                         = "pdx"
  db_subnet_group_name            = aws_db_subnet_group.pdx-modeler-db-subnet-group.name
  tags = {
    Name        = "pdx-modeler-db-${var.buildEnv}"
    Environment = "${var.buildEnv}"
  }

  lifecycle {
    ignore_changes = [
    ]
  }

}