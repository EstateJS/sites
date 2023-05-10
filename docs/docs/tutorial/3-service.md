---
sidebar_label: 'Create a Service'
---

# Create a Service

Estate backends are called **Services**.

The service directory has already been created for you. All that's left is to initialize it.

3. Initialize the service passing the directory and the service name.

```bash
$ estate init service/ --name log-book
```

:::note details
This command creates a directory and a number of files in the service directory:

* A directory named `service/estate-runtime` that contains TypeScript type definitions for the classes and functions your backend code will use at runtime.
* A file named `service.json` that contains metadata about your service. This contains the service's name (that you can change) as well as information about the classes contained in the service.

:::
