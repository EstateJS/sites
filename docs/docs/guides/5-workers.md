---
sidebar_label: 'Workers'
---

# Workers

## Singletons

Workers are globally available Internet-connected singletons. Any number of client applications can call the same shared object instances at the same time.

## Remote Code Execution

Workers are ideal for housing code that needs to be run outside the client such as

* Internal or proprietary business logic (Game servers, User/Account management, Billing data)
* Business rules specifying how data is saved, deleted, etc.
* Any logic that benefits from having in-memory access to the Data element's datastore

:::tip Code Safety
The client generated Service Module will never contain the Worker's actual code. It will contain a Worker proxy class that has the same **interface** (methods, method arguments/types, and return types) as the Worker.
:::

## Stateful

Workers retain the values of all their properties between calls. This makes them stateful.

For example:

```typescript
export class ExerciseTrackerWorker extends Worker {
    private _usernames: Set<string>;
    //...
    addUser(username: string): void {
        if (this._usernames.has(username))
            throw new Error("A user with that name already exists");
        this._usernames.add(username);
    }
```

When client A calls `addUser('Scott')` if the user doesn't already exist it will be saved and the worker's `this._usernames` is updated.  
Later, when client B calls `addUser('Scott')` the user will already exist and client B will get an error.

:::note this
At runtime, inside the worker method code above, `this` is the Worker shared object instance.
:::

## Creating a Worker

To create a Worker you write a POJO that extends the `Worker` base type in service code. The `Worker` type is imported from the provided `estate-runtime` library.

```typescript
import {Worker} from 'estate-runtime';
export class ExerciseTrackerWorker extends Worker {
    //...
    constructor(primaryKey: string) {
        super(primaryKey);
    }
    //...
```

The Worker requires a constructor with a single `string` argument named `primaryKey`. The primaryKey value must be passed to super.

### PrimaryKey

The primaryKey in the above example is an opaque string that, together with the type information, uniquely identifies the Worker instance at runtime.  
PrimaryKeys are unique to the Worker subtype. Meaning, you could have worker types named `FooWorker` and `BarWorker` with the same primaryKey.

## Automatically Created

Worker instances are created automatically the first time a method is called on them. Additionally, they live (in the cloud platform) until you explicitly delete them.

## Calling a Worker

A client application uses this TypeScript syntax to get a worker instance at runtime:

```typescript
const exerciseTracker = estate.getWorker(ExerciseTrackerWorker, "my primary key");
```

The first argument (ExerciseTrackerWorker) is your worker class that extends Worker.

The second argument is the primaryKey. If multiple clients use the same primaryKey, they'll share the same backend Worker instance.

Each different primaryKey string will result in a different Worker instance being created on the backend.

## Call Semantics

When a client calls a method on a Worker proxy, the request is sent over the Internet to the Estate platform where the Worker instance is hosted. The method is called on the Worker instance and if there wasn't an error, the Worker's changed properties are saved to the embedded database.

## Units-of-work

Each worker method call is executed inside a database transaction as a "unit-of-work". As a result, either all code inside the method works or no changes are made to any of the datastores affected. This allows clients to retry calls without fear of data corruption.

## Transaction Success or Failure

When the worker method code is done executing, the following questions are asked to determine whether or not the transaction was successful:

1. Was there a system-level error?
2. Was an unhandled JavaScript exception thrown from user code?
3. Were there any unsaved changes to Data instances? (E.g. Changed `user._firstName` but didn’t call `saveData(user)`)
4. Were there any concurrent, conflicting modifications to any objects modified by this transaction?

If the answer to **any** of these questions is **yes**, the transaction is rolled back causing all Data and Worker modifications made as a result of this call to be undone. The client will receive an exception it can handle gracefully.

However, if the answer to all these questions is **no**, the transaction is **committed**, the worker method call is successful, and the results are returned to the client.  

Workers are very useful but their true power is found when using Data to store, retrieve, and transfer application data.
