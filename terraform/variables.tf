variable "buildEnv" {
  type    = string
  default = "dev"
}

variable "zoneChoice" {
  type    = string
  default = "us-west-2a"
}

variable "zoneChoice2" {
  type    = string
  default = "us-west-2d"
}

variable "instanceType" {
  type    = string
  default = "t2.micro"
}

variable "routeName" {
  type    = string
  default = "example.com"
}

variable "dbInstanceType" {
  type    = string
  default = "db.t3.micro"
}

variable "dbUsername" {
  type      = string
  sensitive = true
}

variable "dbPassword" {
  type      = string
  sensitive = true
}