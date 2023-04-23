---
sidebar_label: 'Introduction'
slug: '/'
---

# Introduction

Get ready to experience life without DevOps or boilerplate.

Estate is a minimalistic, highly abstracted serverless cloud platform where developers create stateful backends by writing TypeScript domain-driven POJOs: just business logic and domain model. The platform handles all the cloud minutea.

No more _REST_. No more interpreting HTTP status code arcanery or web service routing nonsense. Consuming a Estate backend is trivial because all the client-connection code is generated for you.

With no servers to manage nor ‘stacks’ to provision, Estate backends are live with a single command.

![Alt](/img/banner.png "EstateJS Logo")

## Worker

* Write a type that extends Worker.

```typescript
// service/index.ts
class UserManager extends Worker {
  ...
  createUser(userName:string): User {
    ...
  }
}
```

* Get an instance in client code using the same type client-side

```typescript
// client
const worker = getWorker(UserManager, "default");
```

* Call methods on shared stateful services.

```typescript
const user = await worker.createUser("Imscottirl");
```

:::info
Workers are like AWS Lambda functions that remember their state between calls.
:::

## Stateful

* Write a class that extends Data.
* Store or retrieve instances from client code or backend services.
* Optionally, clients can be updated when other clients or services save data changes.

## Want to notify any number of clients when something happens?

* Write a class that extends Message
* Send message instances from inside services.
* Write a handler in client code that gets called when the message is received.

**Get started** now by following the [Tutorial](/tutorial/).
