---
sidebar_label: 'Workers'
---

# Workers

## Singletons

Workers are globally available Internet-connected singletons. Any number of client applications can call the same shared object instances at the same time.

## Remote Execution Model

Workers are ideal for housing code that needs to be run outside the client such as

* Internal or proprietary business logic (Game servers, User/Account management, Billing data)
* Business rules specifying how data is saved, deleted, etc.
* Any logic that benefits from having in-memory access to the Data element's datastore

:::tip Code Safety
The client generated Service Module will never contain the Worker's actual code. It will contain a Worker proxy class that has the same **interface** (methods, method arguments/types, and return types) as the Worker.
:::

## Properties

Workers can contain any number of JavaScript properties with any name. You can create new properties in any Worker method, not just the constructor, just like any other POJO.

### Data Types

Most built-in JavaScript property types are supported including:

* `undefined`
* `null`
* `number`
* `boolean`
* `object`
* `Map`
* `Set`
* `Array`
* `Date`
* `BitInt`
* types that extend `Data`
* types that extend `Worker`

:::note ArrayBuffer
At this time, the ArrayBuffer type is not supported.
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

[Example](https://github.com/EstateJS/exercise-tracker/blob/e84526a452630114fe70c6b75d35c4b78391672e/service/index.ts#L33)

### Contructor Signature

Workers require a constructor with a single `string` argument named `primaryKey`. The primaryKey value must be passed to super.

### PrimaryKey

The primaryKey in the above example is an opaque string that, together with the type information, uniquely identifies the Worker instance at runtime.  
PrimaryKeys are unique to the Worker subtype. Meaning, you could have worker types named `FooWorker` and `BarWorker` with the same primaryKey.

## Automatically Created

Worker instances are created automatically the first time a method is called on them. Additionally, they live (in the cloud platform) until you explicitly delete them.

## Retains State Between Calls

Workers retain the values of all their properties between calls. This makes them stateful.

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

## Calling a Worker

A client application uses this TypeScript syntax to get a worker instance at runtime:

```typescript
const exerciseTracker = estate.getWorker(ExerciseTrackerWorker, "my primary key");
```

[Example](https://github.com/EstateJS/exercise-tracker/blob/e84526a452630114fe70c6b75d35c4b78391672e/src/pages/edit-exercise.tsx#L25)

The first argument (ExerciseTrackerWorker) is your worker class that extends Worker.

The second argument is the primaryKey. If multiple clients use the same primaryKey, they'll share the same backend Worker instance.

Each different primaryKey string will result in a different Worker instance being created on the backend.

## Call Semantics

When a client calls a method on a Worker proxy, the request is sent over the Internet to the Estate platform where the Worker instance is hosted. The method is called on the Worker instance and if there wasn't an error, the Worker's changed properties are saved to the embedded database.

## Automatically Saved

Any property changes made inside a worker method call are saved automatically if the underlying call succeeds.

## Versioned

Workers are transparently versioned. Each time they're changed and saved to the database the version changes. This version is used to ensure clients and workers only work on the latest version of the Worker.

## Transactional Unit-of-Work

Each remote worker method call is executed inside a database transaction. This means either all code inside the method works or no changes are made. This allows clients to retry calls without fear of data corruption.

:::info info
Calling a method on another worker instance from inside a worker instance doesn't result in a new transaction, it uses the same transaction.
:::

:::note Unit-of-Work
See [Martin Fowler's](https://martinfowler.com/eaaCatalog/unitOfWork.html) great explaination of the Unit-of-Work architecture pattern.
:::

### Transaction Success or Failure

When the worker method code is done executing, the following questions are asked to determine whether or not the transaction was successful:

1. Was there a system-level error?
2. Was an unhandled JavaScript exception thrown from user code?
3. Were there any unsaved changes to Data instances? (E.g. Changed `user._firstName` but didn’t call `saveData(user)`)
4. Were there any concurrent, conflicting modifications to any objects modified by this transaction?

If the answer to **any** of these questions is **yes**, the transaction is rolled back causing all Data and Worker modifications made as a result of this call to be undone. The client will receive an exception it can handle gracefully.

However, if the answer to all these questions is **no**, the transaction is **committed**, the worker method call is successful, and the results are returned to the client.  

## Reverting Worker Changes

Sometimes while inside a worker method call you may want to revert all the changes made to the Worker since the start of the transaction without throwing an exception. This can be useful if you want handle a data condition silently, without concerning clients.

```typescript
import {Worker, revertObject} from 'estate-runtime'
export class MyWorker extends Worker {
    fooMethod(): void {
        this.fooValue = 1;      // create  property named fooValue and assign the value 1     
        this.barValue = true;   // create property named barValue and assign the value true
        revertObject(this);     // undoes those two property creations
    }
}
```

:::caution Rare
It's best to avoid using the `revertObject` because it may make your Worker code hard to understand.
:::

## Deletion

Workers can be deleted from inside the Worker itself (or another Worker) using the `deleteObject` function.

```typescript
import {Worker, deleteObject} from 'estate-runtime'
export class MyWorker extends Worker {
    fooMethod(): void {
        deleteObject(this);
    }
}
```

:::info flag
The `deleteObject` function leaves behind a flag in the database to prevent another Worker with the same type and primaryKey from being created. This design prevents accidental recreation. If you do not want this, pass `true` as the second argument to `deleteObject`.
:::
