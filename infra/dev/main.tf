provider "azurerm" {
  version = "=1.28.0"
}

terraform {
  backend "azurerm" {
    storage_account_name = "mmfp"
    container_name       = "tfstate"
    key                  = "dev.tfstate"
    resource_group_name  = "mmfp-global"
  }
}

variable "registry_url" {
  default = "mmfpcontainerregistry.azurecr.io"
}

variable "registry_username" {}

variable "registry_password" {}
variable "docker_image" {}

module "dev" {
  source       = "../modules/aas"
  location     = "uksouth"
  name         = "mmfp-dev"
  docker_image = "mmfpcontainerregistry.azurecr.io/app:${var.docker_image}"

  app_settings = {
    "NODE_ENV"                        = "development"
    "DOCKER_REGISTRY_SERVER_URL"      = "${var.registry_url}"
    "DOCKER_REGISTRY_SERVER_USERNAME" = "${var.registry_username}"
    "DOCKER_REGISTRY_SERVER_PASSWORD" = "${var.registry_password}"
  }

  tags = {
    environment = "dev"
    project     = "mmfp"
    component   = "client"
  }
}

output "dev_url" {
  value = "${module.dev.hostname}"
}

# resource "azurerm_resource_group" "test" {
#   name     = "api-rg-pro"
#   location = "uksouth"
# }


# resource "azurerm_app_service_plan" "test" {
#   name                = "api-appserviceplan-pro"
#   location            = "${azurerm_resource_group.test.location}"
#   resource_group_name = "${azurerm_resource_group.test.name}"
#   kind                = "Linux"
#   reserved            = true


#   sku {
#     tier = "Basic"
#     size = "B1"
#   }
# }


# resource "azurerm_app_service" "test" {
#   name                = "mmo-example-app-service"
#   location            = "${azurerm_resource_group.test.location}"
#   resource_group_name = "${azurerm_resource_group.test.name}"
#   app_service_plan_id = "${azurerm_app_service_plan.test.id}"


#   site_config {
#     linux_fx_version = "DOCKER|mmocontainerregistry1.azurecr.io/nginx:1.15.10"
#   }


#   app_settings = {
#     "SOME_KEY"                        = "some-value"
#     "DOCKER_REGISTRY_SERVER_URL"      = "${azurerm_container_registry.acr.login_server}"
#     "DOCKER_REGISTRY_SERVER_USERNAME" = "${azurerm_container_registry.acr.admin_username}"
#     "DOCKER_REGISTRY_SERVER_PASSWORD" = "${azurerm_container_registry.acr.admin_password}"
#   }
# }


# output "sitename" {
#   value = "${azurerm_app_service.test.default_site_hostname}"
# }


# resource "azurerm_container_registry" "acr" {
#   name                = "mmocontainerRegistry1"                   #only numeric values, no -
#   resource_group_name = "${azurerm_resource_group.test.name}"
#   location            = "${azurerm_resource_group.test.location}"
#   sku                 = "Basic"
#   admin_enabled       = true
# }


# output "login_server" {
#   value = "${azurerm_container_registry.acr.login_server}"
# }


# output "username" {
#   value = "${azurerm_container_registry.acr.admin_username}"
# }


# output "password" {
#   value = "${azurerm_container_registry.acr.admin_password}"
# }


# resource "azurerm_application_insights" "test" {
#   name                = "tf-test-appinsights"
#   location            = "uksouth"
#   resource_group_name = "${azurerm_resource_group.test.name}"
#   application_type    = "web"
# }


# output "instrumentation_key" {
#   value = "${azurerm_application_insights.test.instrumentation_key}"
# }


# output "app_id" {
#   value = "${azurerm_application_insights.test.app_id}"
# }

