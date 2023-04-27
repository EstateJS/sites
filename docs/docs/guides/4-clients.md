---
sidebar_label: 'Clients'
---

# Clients

Once you've deployed your service, you can connect any number of client NPM projects to it.

## Service Module

Connecting a client to a service involves generating client code called a **Service Module**.

The service module contains:

* The classes and functions your client code can use to access the service
* A user key used to authenticate the client code to the Estate platform at runtime
* The version number of the deployed service

## Generating a Service Module

To create a service module for your service you issue the `connect` command passing the client code base NPM project directory and the service name you wish to create the service module that connects to.

```bash
$ estate connect . <service-name>
```

The service module will be generated in the `.estate/generated-clients/<service-name>` directory. It is automatically set as a dependency in the client code base's package.json.

:::caution pnpm
If you use pnpm you may need to  delete your node_modules folder and re-run `pnpm i` if you get runtime errors after re-generating your service module.
:::

## Importing

The service module is unique to the service and will be named `<service-name>-service`. The service module can be imported just like any other NPM module in your node_modules directory.

### CommonJS import

```typescript
const {User, Exercise} = require('exercise-tracker-service');
```

### ESM import

```typescript
import {User, Exercise} from 'exercise-tracker-service';
```
