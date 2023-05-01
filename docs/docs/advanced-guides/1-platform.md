---
sidebar_label: 'Platform'
---

# Platform

The Estate Platform is the underlying cloud technology that administers, orchestrates, and runs backend stateful serverless Services.

It consists of two layers:

* The admin layer which is used to administer users and services. This is written in C# and the code is [here](https://github.com/estatejs/system/platform/dotnet).

:::note
The `estate-tools` CLI package talks to the admin layer.
:::

* The runtime layer which the clients talk directly to at runtime. This is written in modern Rust-like C++ and the code is [here](https://github.com/estate/platform/native).

The runtime layer consists of two C++ daemons:

1. **Serenity**: the AppServer/Database that marries JavaScript running in V8 to the data stored in an in-process RocksDB instance.
   1. Code running in V8 and the RocksDB instance live in a process-isolated sandbox where only your service code executes.
2. **River**: the WebSocket server that routes and validates requests to Serenity from the Internet.

:::note
The `estate-js` client package talks to River using secure WebSockets.
:::
