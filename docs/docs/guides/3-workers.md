---
sidebar_label: 'Workers'
sidebar_position: 6
---
# Services - stateful microservices

Service instances are global internet-connected singletons. Meaning, any number of client application instances can get references to Service shared object instances at the same time.

## Obtaining service instances

A client application uses this TypeScript syntax to get a service instance at runtime:

```typescript
const myService = database.getService(MyService,"my primary key");
```

The first argument (MyService) is your service class that extends Service. The second argument is called the primaryKey. This is an opaque string that when combined with the service class, uniquely identifies the service instance living the database.

Service instances are created automatically the first time a method is called on them. Additionally, they live until you explicitly delete them (see the Database Runtime API documentation for more details).

## Executing remote code

Once a client has a reference to an instance of a Service in the database, it can make asynchronous calls
to its methods. Each call routes through Estate and executes on the service object instance in Database
Space. At runtime, inside the service method code running in the database, `this` is the service object instance.

## Units-of-work

Each service method call is executed inside a datastore transaction. The service method code that’s executed does so as a unit-of-work. As a result, either everything succeeds or no changes are made to any of the datastores affected. This allows clients to retry calls without fear of data corruption.

## Transaction Success or Failure

When the service method code is done executing, the following questions are asked to determine whether or
not the transaction was successful:

1. Was there a system-level error?
2. Was an unhandled JavaScript exception thrown from user code?
3. Were there any unsaved changes to Data instances? (E.g. Changed `user._firstName` but didn’t call `system.saveData(user)`)
4. Were there any concurrent, conflicting modifications to any objects modified by this transaction?

If the answer to any of these questions is yes, the transaction is rolled back causing all object and service modifications made as a result of this call to be undone. The client will receive an exception it can handle gracefully by retrying the call etc.  

However, if the answer to all these questions is no, the transaction is committed, the service method call is successful, and the results are returned to the client.  

Services are very useful but their true power is found when using Data to store, retrieve,
and transfer application data.
