---
sidebar_label: 'Data'
---

# Data

Data elements are used to keep, use, and share structured data.  

Data elements are like spreadsheets where the columns are TypeScript properties and each row is a unique instance.

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

:::note ArrayBuffer
At this time, the ArrayBuffer type is not supported.
:::

## Business Logic

Data elements are ideal for holding business data because you can write business logic (getters and setters) that ensure property values are valid before they're changed or returned.  

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

The Data element construtor can contain any number of arguments. However, a `primaryKey` must be passed to super.

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

## Retrieving

### Retrieving client-side

Data instances can be retrieved client-side using the `getDataAsync` method off the `estate` object. Pass the Data-derived type as the first argument and the primaryKey as the second. This will load the object into local client memory where it can be displayed in a UI element or modified just like any other JavaScript object.

```typescript
const user = await estate.getDataAsync(User, "a primary key");
```

### Retrieving from inside a Worker

Data instances can be retrieved while inside a worker with the `getData` function imported from the provided `estate-runtime` library.

```typescript
const user = getData(User,"a primary key");
```

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

A promise is returned that resolves when and if the Data element's changes are written to the database. Since you're already inside the worker, this does not involve a network round-trip.

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

:::tip tip
The `saveData` function only saves the Data element you pass to it, not any Data elements in properties. If you'd like to save all the entire tree off Data elements, use the `saveDataGraphs` function instance.
:::

#### Unsaved Data Protection

When you pass a Data element that's either new or has been modified to a Worker, the data element must be saved (or reverted) before the end of the transaction. Otherwise the transaction will fail and the client will get an `UnsavedChanges` exception.

:::note design
This design prevents makes incomplete data modifications easier to avoid.
:::

## Deletion

Data elements can be deleted from inside a Worker using the `deleteObject` function.

```typescript
import {Worker, deleteObject} from 'estate-runtime'
export class MyWorker extends Worker {
    fooMethod(myData: Data): void {
        deleteObject(myData);
    }
}
```

### Recreation Prevention

The `deleteObject` function leaves behind a flag in the database to prevent another Data element with the same type and primaryKey from being created. This design is to prevent accidental recreation. If you do not want this feature, pass `true` as the second argument to `deleteObject`.

## Keeping Data Updated Automatically

Client-side instances of Data elements can be kept updated automatically when other clients or workers make changes.

:::tip note
This feature allows clients to get a Data element once and then rely on it to stay up to date as other clients make changes over time. This is useful for instance, when building real-time app dashboards, or real-time chat application, or anytime you'd like to share real-time state between a number of computers.
:::

:::note Client-side only
Data elements are natively kept up to date when inside a Service so there's no need to subscribe on the backend.
:::

### Create a data update subscription

* Use the `subscribeUpdatesAsync` function on the `estate` object to subscribe to updates

```typescript
const chatRoom = await estate.getDataAsync(ChatRoom, '#general');
await estate.subscribeUpdatesAsync(chatRoom);
```

This command keeps the `ChatRoom` object pointed to by the `chatRoom` variable updated.  

:::tip underlying object
Even if you had mulitiple copies of the `chatRoom` variable, with different variable names, the object they all point to will be kept updated by `Estate` via the subscription.
:::

### Update Notification

Additionally, after you've subscribed to updates for a Data element you can get notified after updates have been made. This is a great place to refresh your UI or otherwise make presentation-layer changes.

* Attach a listener with the `addUpdateListener` function on the `estate` object

```typescript
//...
let motd: string;
estate.addUpdateListener(chatRoom, (e: DataUpdatedEvent<ChatRoom>) => {
    if (e.deleted) {
        console.log(`${e.target.Name}: Removed`);
    } else {
        if(motd !== e.target.messageOfTheDay) {
            motd = e.target.messageOfTheDay;
            console.log(`${e.target.Name}: MOTD updated "${motd}"`);
        }
    }
})
```

Now, anytime the `#general` `ChatRoom` Data element is updated, the handler will be called.
