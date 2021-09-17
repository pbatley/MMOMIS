provider "azurerm" {
  version         = "1.23"
}

provider "azurerm" {
  version = "=1.28.0"
}

terraform {
  backend "azurerm" {
    storage_account_name = "mmfp"
    container_name       = "tfstate"
    key                  = "global.tfstate"
    resource_group_name  = "mmfp-global"
  }
}

data "azurerm_resource_group" "this" {
  name = "mmfp-global"
}

resource "azurerm_container_registry" "acr" {
  name                = "mmfpContainerRegistry"                        #only numeric values, no -
  resource_group_name = "${data.azurerm_resource_group.this.name}"
  location            = "${data.azurerm_resource_group.this.location}"
  sku                 = "Basic"
  admin_enabled       = true
}

output "arc_url" {
  value = "${azurerm_container_registry.acr.login_server}"
}

output "acr_username" {
  value = "${azurerm_container_registry.acr.admin_username}"
}

output "acr_password" {
  value = "${azurerm_container_registry.acr.admin_password}"
}
