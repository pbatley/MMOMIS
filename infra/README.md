# Provisioning the infrastructure

## Design proposal

> The assumption is that all resources are created in a single subscription.

The Terraform code should be organised in two layers:

1. a global layer that creates global resources such as the Azure Container Registry and the blob storage for the state
1. an application specific layer

We should have two applications to start with: development and production.
Each application has its Terraform state.

The proposed virtual machines for the two applications are:

1. For development, a B1 Basic
1. For production, an S1 Standard

You can find the full [list of available virtual machines from the official website](https://azure.microsoft.com/en-us/pricing/details/app-service/windows/).

## First run

> You should execute this step only the first time.

The first step is to install the Azure CLI. You can find detailed [instructions on how to install it on the official website](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest).

You can link your Azure CLI to your account with:

```bash
az login
```

And you can list your accounts with:

```bash
az account list
```

**Make a note now of your subscription id.**

You can create the Service Principal with:

```bash
az ad sp create-for-rbac -n "mmfp" --role="Contributor" --scopes="/subscriptions/SUBSCRIPTION_ID"
```

The previous command should print a JSON payload like this:

```json
{
  "appId": "00000000-0000-0000-0000-000000000000",
  "displayName": "azure-cli-2017-06-05-10-41-15",
  "name": "http://azure-cli-2017-06-05-10-41-15",
  "password": "0000-0000-0000-0000-000000000000",
  "tenant": "00000000-0000-0000-0000-000000000000"
}
```

Make a note of the `appId`, `password` and `tenant`. You need those to set up Terraform.

Export the following environment variables:

```bash
export ARM_CLIENT_ID=<insert the appId from above>
export ARM_SUBSCRIPTION_ID=<insert your subscription id>
export ARM_TENANT_ID=<insert the tenant from above>
export ARM_CLIENT_SECRET=<insert the password from above>
```

Create a global storage account

```bash
az group create -n mmfp-global -l uksouth --tags project=mmfp component=global
az storage account create -n mmfp -l uksouth --sku Standard_LRS -g mmfp-global
# retrieve a key with
az storage account keys list --account-name mmfp --resource-group mmfp-global --output table
# use the key to create a container
az storage container create --name tfstate --account-name mmfp --account-key <key1 or key2>
```

## Terraform

You should install the Terraform CLI. You can [follow the instructions from the official website](https://learn.hashicorp.com/terraform/getting-started/install.html).

If the installation is successful, you should be able to test it by printing the current version of the binary:

```bash
terraform version
```

You can provision the infrastructure with:

```bash
cd infra
terraform plan
terraform apply
```

You can destroy the existing infrastructure with:

```bash
terraform destroy
```