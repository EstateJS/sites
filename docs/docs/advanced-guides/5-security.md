---
sidebar_label: 'Security'
---

# Security

## O-Auth via Google Cloud

The Estate platform uses accounts provided by Google Cloud's O-Auth platform using three providers:

* Guest
* Google account
* GitHub

## Accountsdb, where Estate account metadata lives

Account information is stored in a MySQL database ("accountsdb") and administered by the admin layer's C# service. 

## Admin layer security

When the `estate-tools` package logs in, it will authenticate with Google's O-Auth platform and write your credentials to `${HOME}/.config/estate/login.json`. These admin credentials are passed to the admin layer C# microservice to verify you have access.

## Runtime layer security

Once you've logged in and received your admin credentials, you're able to create a key so clients can access your services at runtime.
The `estate connect` command instructs the admin layer to generate a client key and store it in Redis. River (the runtime ingress daemon) queries Redis when each client tries to establish a WebSocket connection to verify its client key is still valid.

:::note key
The client key is stored directly in the generated service module source code. Because of this, the `.estate` directory needs to be checked into source control.
:::
