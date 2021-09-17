variable "location" {
  default = "uksouth"
}

variable "name" {}

variable "docker_image" {}

variable "app_settings" {
  type = "map"
}

variable "tags" {
  type = "map"
}

resource "azurerm_resource_group" "test" {
  name     = "aas-mmfp-${var.name}"
  location = "${var.location}"

  tags = "${var.tags}"
}

resource "azurerm_app_service_plan" "test" {
  name                = "asp-mmfp-${var.name}"
  location            = "${azurerm_resource_group.test.location}"
  resource_group_name = "${azurerm_resource_group.test.name}"
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Basic"
    size = "B1"
  }
}

resource "azurerm_app_service" "test" {
  name                = "${var.name}"
  location            = "${azurerm_resource_group.test.location}"
  resource_group_name = "${azurerm_resource_group.test.name}"
  app_service_plan_id = "${azurerm_app_service_plan.test.id}"

  site_config {
    linux_fx_version = "DOCKER|${var.docker_image}"
  }

  app_settings = "${var.app_settings}"
}

output "hostname" {
  value = "${azurerm_app_service.test.default_site_hostname}"
}
