provider "aws" {
  region = var.aws_region
}

# VPC Configuration
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "visvasahome-vpc-${var.environment}"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = var.environment == "staging" ? true : false

  tags = {
    Environment = var.environment
    Project     = "VisvasaHome"
  }
}

# EKS Cluster for Microservices
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "visvasahome-${var.environment}-cluster"
  cluster_version = "1.29"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    backend = {
      min_size     = var.environment == "production" ? 3 : 1
      max_size     = var.environment == "production" ? 10 : 3
      desired_size = var.environment == "production" ? 3 : 1

      instance_types = ["t3.medium"]
    }
  }

  tags = {
    Environment = var.environment
  }
}

# RDS PostgreSQL for ACID core (Users, Bookings, Payments)
module "db" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"

  identifier = "visvasahome-db-${var.environment}"

  engine               = "postgres"
  engine_version       = "15.4"
  family               = "postgres15" # DB parameter group
  major_engine_version = "15"         # DB option group
  instance_class       = var.db_instance_class

  allocated_storage     = 20
  max_allocated_storage = 100

  db_name  = "visvasahome"
  username = "vh_admin"
  port     = 5432

  multi_az               = var.environment == "production" ? true : false
  subnet_ids             = module.vpc.private_subnets
  vpc_security_group_ids = [module.vpc.default_security_group_id]

  tags = {
    Environment = var.environment
  }
}

# RDS PostgreSQL Read Replica (Reporting/Offloading)
module "db_replica" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"

  count = var.environment == "production" ? 1 : 0

  identifier = "visvasahome-db-replica-${var.environment}"

  # Source database
  replicate_source_db = module.db.db_instance_identifier

  engine               = "postgres"
  engine_version       = "15.4"
  family               = "postgres15"
  major_engine_version = "15"
  instance_class       = var.db_instance_class

  port = 5432

  multi_az               = false
  vpc_security_group_ids = [module.vpc.default_security_group_id]

  tags = {
    Environment = var.environment
    Role        = "ReadReplica"
  }
}

# MSK (Managed Streaming for Apache Kafka) for event-driven async queues
resource "aws_msk_cluster" "kafka" {
  cluster_name           = "visvasahome-kafka-${var.environment}"
  kafka_version          = "3.5.1"
  number_of_broker_nodes = var.environment == "production" ? 3 : 2

  broker_node_group_info {
    instance_type   = "kafka.t3.small"
    client_subnets  = [module.vpc.private_subnets[0], module.vpc.private_subnets[1]]
    security_groups = [module.vpc.default_security_group_id]
  }

  tags = {
    Environment = var.environment
  }
}

# ElastiCache Redis for fast matching, queues, rate limiting
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "visvasahome-redis-${var.environment}"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.redis_subnet.name
}

resource "aws_elasticache_subnet_group" "redis_subnet" {
  name       = "visvasahome-redis-subnet-${var.environment}"
  subnet_ids = module.vpc.private_subnets
}
