# Explore marine plans

[![Build Status](https://dev.azure.com/mmodigital/mis/_apis/build/status/mmodigital.MIS_application?branchName=master)](https://dev.azure.com/mmodigital/mis/_build/latest?definitionId=18&branchName=master)
[![dependencies Status](https://david-dm.org/mmodigital/MIS_application/status.svg)](https://david-dm.org/mmodigital/MIS_application)
[![Licence](https://img.shields.io/badge/Licence-OGLv3-blue.svg)](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3)

GOV.UK front end service built using Node.js for the [Explore marine plans](https://explore-marine-plans.marineservices.org.uk) digital service.

The Explore Marine Plans digital service will be a new, online way to explore the Marine Policies and Plans in the UK territorial waters.

This service is currently beta and has been developed in accordance with the [Digital by Default service standard](https://www.gov.uk/service-manual/digital-by-default), putting user needs first and delivered iteratively.

## Prerequisites

Please make sure the following are installed:

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js v10/Dubnuim](https://nodejs.org/en/) We recommend installing nvm and using `nvm install --lts`

Check that your environment is running the correct versions of `node` and `npm`:
```bash
$ npm --version
6.9.0
$ node --version
v10.15.3
```

## Installation

Clone the repository and install its package dependencies:
```bash
$ git clone https://github.com/DEFRA/mmo-explore-marine-plans && cd ./mmo-explore-marine-plans
$ npm install
```

Once you have the repo cloned you'll need to build it.:
```bash
$ npm run bootstrap
```

> Please note that the repo is managed by [lerna](https://github.com/lerna/lerna), but the packages are not installed using `lerna bootstrap`. This is to get around dependency resolution in webpack and webpack-dojo.

## Running the app

You can watch for changes in the front-end and start the server with:
```bash
$ cd ./packages/client && npm run dev
$ cd ../../packages/backend && npm run dev
```

## Testing the app

Use the following to run the unit test suite
```bash
$ npm test
```

And the following to run the End 2 End tests that connect interact with the MMO Marine Policy Summary APIs and the DEFRA Date Platform
```bash
$ npm run test:e2e
```

## Containers

You can package the app as a Docker container with:
```bash
docker build -t mmo-explore-marine-plans .
```

And then you can run the app, using the MMO Marine Policy Summary APIs and the DEFRA Date Platform, with:
```bash
docker run -p 3000:3000 -ti mmo-explore-marine-plans
```

## Releasing code

Every time a build is successful the corresponding commit is tagged with a `build-<N>` label.

For every successful build, that build is automatically deployed to a dev environment. If the deployment is successful, the corresponding commit is tagged with a `dev-<N>` build.

You can promote a build to a QA environment if you tagged the commit for a successful build with `qa-<N>`.

```bash
git tag -a qa-<N> -m "<message>"
```

## Contributing to this project

Please read the [contribution guidelines](/CONTRIBUTING.md) before submitting a pull request.

## License

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the license

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
