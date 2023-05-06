---
sidebar_label: 'Services'
---

# Services

Estate hosts serverless cloud backends called **Services** that your applications can access at runtime using automatically generated client code.

## Service Code

Services are comprised of functions and POJOs (Plain Old JavaScript Objects) written in either TypeScript or JavaScript.

## Service Creation

To create a service you must create a new folder and initialize it. Initializing the service folder creates a `service.json` file inside the folder that contains the service's name and other service metadata.

To initialize a service you use the init command passing it the directory and the service's name

```bash
$ mkdir my-service
$ cd my-service
$ estate init . --name my-service-name
```

You can only initialize a service once.

:::warning Source Control
You should store the `service/service.json` file as well as the `service/estate-runtime` directory in source control.
:::

## Service Deployment

Once the service code is written, or you've made code changes, you must deploy it to Estate before it can be used.

To deploy your service code changes use the deploy command passing it the service directory

```bash
$ estate deploy .
```

### Service Version

Each time you deploy your service it increases the internal service version number. Doing so ensures clients can't use out of date service code, preventing certain types of data corruption.

## Listing Deployed Services

At any time you can show the list of services that have been deployed using the `list` command.

```bash
estate list
```

## Renaming Services

You can change the name of your service using this process:

1. Change the name of the service in the `service.json` file in the service code directory.
2. Deploy the service to complete the renaming.

:::caution Dangling Clients
If you've used the `connect` command to create a service module for the old service name, you'll need to manually delete the old service module from your clients.


1. Delete the `.estate/generated-clients/<old-service-name>` folder.
2. Delete the dependency from the package.json

```javascript
"dependencies": {
    ...
    "<old-service-name>-service": "file:./.estate/generated-clients/<old-service-name>"
  },
```
3. Run `pnpm i` (or `npm install` etc) to clean up your node_modules directory.
4. Use the connect command to connect the new service.

:::