---
sidebar_label: 'Generate a service module'
---

# Generate a Service Module

Front-end code connects to Services using a code-generated **Service Module**. A service module is used like any other NPM package. It contains all the types/functions necessary to talk to your service from the front-end at runtime as well as .d.ts files.

1. Call connect, passing it the front-end NPM project directory as well as the service name.

```bash
$ estate connect . log-book
```

:::tip tip
If you're unsure what your service is named, the `estate list` command will show you.
:::

:::tip tip
The `.` path argument must point to the directory where your `package.json` file is located.
:::

1. Answer `pnpm` when it asks you to install node modules.
