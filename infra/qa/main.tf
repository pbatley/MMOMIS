provider "azurerm" {
  version = "=1.28.0"
}

terraform {
  backend "azurerm" {
    storage_account_name = "mmfp"
    container_name       = "tfstate"
    key                  = "qa.tfstate"
    resource_group_name  = "mmfp-global"
  }
}

variable "registry_url" {
  default = "mmfpcontainerregistry.azurecr.io"
}

variable "registry_username" {}

variable "registry_password" {}
variable "docker_image" {}

module "qa" {
  source       = "../modules/aas"
  location     = "uksouth"
  name         = "mmfp-qa"
  docker_image = "mmfpcontainerregistry.azurecr.io/app:${var.docker_image}"

  app_settings = {
    "NODE_ENV"                        = "production"
    "DOCKER_REGISTRY_SERVER_URL"      = "${var.registry_url}"
    "DOCKER_REGISTRY_SERVER_USERNAME" = "${var.registry_username}"
    "DOCKER_REGISTRY_SERVER_PASSWORD" = "${var.registry_password}"
  }

  tags = {
    environment = "qa"
    project     = "mmfp"
    component   = "client"
  }
}

output "qa_url" {
  value = "${module.qa.hostname}"
}
