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

variable "key_name" {}

variable "allowIp" {
  type = string
}

resource "tls_private_key" "ec2_ssh_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "generated_key" {
  key_name   = var.key_name
  public_key = tls_private_key.ec2_ssh_key.public_key_openssh
}

resource "aws_vpc" "pdx_vpc" {
  cidr_block = "172.16.0.0/16"
  tags = {
    Name = "pdx-modeler-vpc"
  }
}

resource "aws_main_route_table_association" "a" {
  vpc_id         = aws_vpc.pdx_vpc.id
  route_table_id = aws_route_table.pdx-modeler-routetable.id
}

resource "aws_route_table" "pdx-modeler-routetable" {
  vpc_id = aws_vpc.pdx_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.gw.id
  }

  tags = {
    Name        = "pdx-modeler-routetable"
    Environment = "${var.buildEnv}"
  }
}


resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh"
  description = "Allow SSH inbound traffic"
  vpc_id      = aws_vpc.pdx_vpc.id

  ingress {
    description = "SSH from H3"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${var.allowIp}"]
  }

  ingress {
    description = "Allow HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "allow_ssh"
  }
}

resource "aws_subnet" "subnet" {
  vpc_id            = aws_vpc.pdx_vpc.id
  cidr_block        = "172.16.10.0/24"
  availability_zone = var.zoneChoice

  tags = {
    Name        = "pdx-modeler-subnet-${var.zoneChoice}"
    Environment = "${var.buildEnv}"
  }
}

resource "aws_subnet" "subnet2" {
  vpc_id            = aws_vpc.pdx_vpc.id
  cidr_block        = "172.16.100.0/24"
  availability_zone = var.zoneChoice2

  tags = {
    Name        = "pdx-modeler-subnet-${var.zoneChoice2}"
    Environment = "${var.buildEnv}"
  }
}

data "aws_ami" "ubuntu" {
  most_recent = false

  filter {
    name   = "name"
    # values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-20220810-aced0818-eef1-427a-9e04-8ba38bada306"]
  }
}


resource "aws_instance" "pdxModelerEc2" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instanceType
  key_name      = aws_key_pair.generated_key.key_name
  subnet_id     = aws_subnet.subnet.id

  tags = {
    name        = "pdx_modeler"
    Environment = "${var.buildEnv}"
  }

  private_ip = "172.16.10.100"

  vpc_security_group_ids = [aws_security_group.allow_ssh.id]

  connection {
    type        = "ssh"
    user        = "ubuntu"
    host        = self.public_ip
    private_key = tls_private_key.ec2_ssh_key.private_key_openssh
  }

}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.pdx_vpc.id
}


resource "aws_eip" "pdxec2ip" {
  vpc = true

  instance                  = aws_instance.pdxModelerEc2.id
  associate_with_private_ip = "172.16.10.100"
  depends_on                = [aws_internet_gateway.gw]
}

resource "null_resource" "provision" {
  connection {
    type        = "ssh"
    user        = "ubuntu"
    host        = aws_instance.pdxModelerEc2.public_ip
    private_key = tls_private_key.ec2_ssh_key.private_key_openssh
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update -y",
      "sudo apt-get install docker.io -y",
      "sudo chmod 666 /var/run/docker.sock",
    ]
  }

  depends_on = [
    aws_eip.pdxec2ip,
    aws_instance.pdxModelerEc2,
    tls_private_key.ec2_ssh_key
  ]
}

output "private_key" {
  value     = tls_private_key.ec2_ssh_key.private_key_pem
  sensitive = true
}

output "subnet_id" {
  value = aws_subnet.subnet.id
}

output "subnet_id2" {
  value = aws_subnet.subnet2.id
}