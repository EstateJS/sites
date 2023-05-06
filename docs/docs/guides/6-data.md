---
sidebar_label: 'Data'
---

# Data

Data elements are used to keep, use, and share structured data.  

Data elements are like spreadsheets where the columns are TypeScript properties and each row is a unique instance.

## Versioned

Data elements are transparently versioned. Each time they're saved to the database the version changes. This version is used to ensure clients and workers only work on the latest version of the Data element.

## Properties

Data can contain any number of JavaScript properties with any name. You can create new properties in any Data method, not just the constructor, just like any other POJO.

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

## Business Logic

Data elements are ideal for holding business data because you can write business logic (getters/setters, methods) that ensure property values are valid before they're changed or returned.  

### Local Execution

When a client or a worker calls functions on Data elements, they're executed inside the same process just like any other function. In other words, regardless of whether the Data element's functions are called from inside a Worker or client-side, the same logic will be called.

## Creating a new Data element

To create a Data element you write a POJO that extends the `Data` base type in service code. The `Data` type is imported from the provided `estate-runtime` library.

```typescript
import {Data} from 'estate-runtime';
export class User extends Data {
    constructor(public username: string) {
        super(username);
    }
}
```

[Example](https://github.com/EstateJS/exercise-tracker/blob/e84526a452630114fe70c6b75d35c4b78391672e/service/index.ts#L18)

The Data element constructor can contain any number of arguments. However, a `primaryKey` must be passed to super.

### PrimaryKey

All Data elements have an immutable `primaryKey` property that's set in the constructor by passing a string to `super`.

:::tip Type-scoped Uniqueness
PrimaryKeys are unique to the Data subtype. Meaning, you could have Data types named `User` and `Exercise` with the same `primaryKey` but not two `User` instances with the same primaryKey.
:::

## Instantiating

You create new Data object instances using the `new` operator. This works client-side as well as within workers.

```typescript
const user = new User('Scott');
```

[Example](https://github.com/EstateJS/exercise-tracker/blob/e84526a452630114fe70c6b75d35c4b78391672e/src/pages/create-exercise.tsx#L44)

## Retrieving

### Retrieving client-side

Data instances can be retrieved client-side using the `getDataAsync` method off the `estate` object. Pass the Data-derived type as the first argument and the primaryKey as the second. This will load the object into local client memory where it can be displayed in a UI element or modified just like any other JavaScript object.

```typescript
const user = await estate.getDataAsync(User, "a primary key");
```

[Example](https://github.com/EstateJS/exercise-tracker/blob/e84526a452630114fe70c6b75d35c4b78391672e/src/pages/edit-exercise.tsx#L29)

### Retrieving from inside a Worker

Data instances can be retrieved while inside a worker with the `getData` function imported from the provided `estate-runtime` library.

```typescript
const user = getData(User,"a primary key");
```

[Example](https://github.com/EstateJS/exercise-tracker/blob/e84526a452630114fe70c6b75d35c4b78391672e/service/index.ts#L65)

The arguments are the same as the clients-side example above. This loads the object into Service memory for use during the service method call. You can make changes or use the object like any other JavaScript object and even return it to the client.

## Saving

Data element changes must be saved to be made permanent. This is a manual process that involves a single function call either client-side or from inside a Worker.

### Saving client-side

Data can be saved to the database on the client using the `saveDataAsync` function on the `estate` object. This requires a network round-trip.

```typescript
//...
user.lastName = 'Jones';
await estate.saveDataAsync(user);
```

[Example](https://github.com/EstateJS/exercise-tracker/blob/e84526a452630114fe70c6b75d35c4b78391672e/src/pages/edit-exercise.tsx#L71)

A promise is returned that resolves when and if the Data element's changes are written to the database.

### Saving from inside a Worker

Data can be saved from inside a Worker using the `saveData` function.

```typescript
import {Worker, saveData} from 'estate-runtime';
export class ExerciseTrackerWorker extends Worker {
    addUser(username: string) {
        const user = new User(username);
        saveData(user);
    }
}
```

[Example](https://github.com/EstateJS/exercise-tracker/blob/e84526a452630114fe70c6b75d35c4b78391672e/service/index.ts#L54)

:::note object graph
The `saveData` function only saves the Data element you pass to it, not any Data elements in properties. If you'd like to save an entire tree of Data elements, use the `saveDataGraphs` function.
:::

#### Unsaved Data Protection

When Data elements are modified inside a Worker, the Data element must either be saved or reverted before the end of the Worker method transaction. Otherwise the transaction will fail and the client will get an `UnsavedChanges` exception.

Additionally, if a new Data element or one that has changes is passed to a Worker method, this will count as unsaved changes.

:::note design
This design prevents makes incomplete data modifications easier to avoid.
:::

## Deletion

Data elements can be deleted from inside a Worker using the `deleteObject` function.

```typescript
import {Worker, deleteObject} from 'estate-runtime'
export class ExerciseTrackerWorker extends Worker {
    //...
    deleteExercise(primaryKey: string) {
        const exercise = getData(Exercise, primaryKey);
        if (exercise) {
            this._exerciseIndex.delete(exercise.primaryKey);
            deleteObject(exercise);
        } else {
            throw new Error('Failed to delete exercise because it does not exist');
        }
    }
}
```

[Example](https://github.com/EstateJS/exercise-tracker/blob/e84526a452630114fe70c6b75d35c4b78391672e/service/index.ts#L92)

:::tip Recreation Prevention
The `deleteObject` function leaves behind a flag in the database to prevent another Data element with the same type and primaryKey from being created. This design is to prevent accidental recreation. If you do not want this feature, pass `true` as the second argument to `deleteObject`.
:::

## Keeping Data Updated Automatically

Client-side instances of Data elements can be kept updated automatically when other clients or workers make changes.

This feature allows clients to get a Data element once and then rely on it to stay up to date as other clients make changes over time. This is useful for instance, when building real-time app dashboards, or real-time chat application, or anytime you'd like to share real-time state between a number of computers.

:::note Workers
Data elements are natively kept up to date when inside a Worker so there's no need to subscribe in backend code.
:::

### Create a data update subscription

Use the `subscribeUpdatesAsync` function on the `estate` object to subscribe to updates on one or more Data elements.

```typescript
await estate.subscribeUpdatesAsync(exercises);
```

[Example](https://github.com/EstateJS/exercise-tracker/blob/e84526a452630114fe70c6b75d35c4b78391672e/src/pages/exercises-list.tsx#L60)

This command keeps the `Exercise` objects pointed to by the `exercises` variable updated.  

:::tip underlying object
Even if you had mulitiple copies of the `exercises` variable, with different variable names, the objects they all point to will be kept updated by `Estate` via the subscription.
:::

### Update Notification

Additionally, after you've subscribed to updates for a Data element you can get notified after updates have been made. This is a great place to refresh your UI or otherwise make presentation-layer changes.

Attach a listener with the `addUpdateListener` function on the `estate` object passing it one or more Data elements to attach the listener to and a callback function you want called when updates happen.

```typescript
estate.addUpdateListener(exercises, (e: DataUpdatedEvent<Exercise>) => {
    if (e.deleted) {
        console.log(`${e.target.primaryKey} deleted`);
    } else {
        console.log(`${e.target.primaryKey} updated`);
    }
});
```

[Example](https://github.com/EstateJS/exercise-tracker/blob/e84526a452630114fe70c6b75d35c4b78391672e/src/pages/exercises-list.tsx#L83)

Now, anytime the `Exercise` Data elements pointed to by the `exercises` variable receives an update, the callback is called.  

The `e.target` property contains the Data element that was updated.

### Unsubscribing from Updates

It's a good idea to unsubscribe from updates to Data elements once you no longer need to receive them. A good place to do this in a UI is a page's tear-down logic.

Unsubscribe from updates to one or more Data elements using the `unsubscribeUpdatesAsync` function on the `estate` object passing it one or more Data elements you previously subscribed to

```typescript
await estate.unsubscribeUpdatesAsync(exercises);
```

[Example](https://github.com/EstateJS/exercise-tracker/blob/e84526a452630114fe70c6b75d35c4b78391672e/src/pages/exercises-list.tsx#L93)

:::note listeners
This automatically removes listeners added using `addUpdateListeners`.
:::

:::note Automatic Cleanup
By design, the Estate platform doesn't depend on client code acting properly. Estate will automatically delete all your Data update subscriptions shortly after the `estate` object is collected by the client's Garbage Collector.
:::
