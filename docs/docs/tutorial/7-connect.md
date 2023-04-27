---
sidebar_label: 'Generate a Service Module'
---

# Generate a Service Module

Front-end code connects to Services using a code-generated **Service Module**. A service module is used like any other NPM package. It contains all the types/functions necessary to talk to your service from the front-end at runtime as well as .d.ts files.

7. Connect your NPM project to your service passing NPM project directory as well as the service name

```bash
$ estate connect . log-book
```

:::note NPM Directory
The `.` path argument must point to the directory where your `package.json` file is located.
:::

:::tip tip
If you're unsure what your service is named, the `estate list` command will show you.
:::


8. Answer `pnpm` when it asks you to install node modules.
