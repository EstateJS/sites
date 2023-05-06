---
sidebar_label: 'Messages'
---

# Messages

Messages are an efficient way to send events from Workers that clients can handle. This feature, in effect, lets Workers call client-side code.

:::tip SSE
This is an implementation of [Server-Sent-Events](https://en.wikipedia.org/wiki/Server-sent_events).
:::

## One-way: Worker to Clients

Messages are sent from inside Workers to any number of subscribed clients.

## Properties

Messages can contain any number of JavaScript properties with any name.

:::tip Properties Provide Context
You’re free to include all relevant context when you send message instances. For example, a `UserAdded` message may include a property `user` that has an instance of the `User` (Data) that was added.
:::

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

## Creating a new Message

To create a Message you write a POJO that extends the `Message` base type in service code. The `Message` type is imported from the provided `estate-runtime` library.

```typescript
import {Message} from 'estate-runtime';
export class ExerciseAdded extends Message {
    constructor(public exercise: Exercise) {
        super();
    }
}
```

[Example](https://github.com/EstateJS/exercise-tracker/blob/e84526a452630114fe70c6b75d35c4b78391672e/service/index.ts#L12)

This creates a Message that contains a single Data element property. When this Message is sent, its properties go with it to any clients who are subscribed. The constructor can take any number of arguments.

:::note Transient
Messages do not have a primaryKey because they're never stored in the database. They're meant to be instanciated, sent, and discarded but never saved or persisted.
:::

## Instantiating and Sending a Message

You create new Messages using the `new` operator and use the `sendMessage` function from the `estate-runtime` library to send the message.

```typescript
import {sendMessage} from 'estate-runtime';
//...
sendMessage(this, new ExerciseAdded(exercise));
```

[Example](https://github.com/EstateJS/exercise-tracker/blob/e84526a452630114fe70c6b75d35c4b78391672e/service/index.ts#L85)

The first argument is the `source`, this can be either a `Data` element instance or a `Worker` instance. In this example, `this` is the `ExerciseTrackerWorker` instance.  
The second argument is the `Message` instance you want to send.

## Subscribing to Messages

To subscribe to receive messages in client-code you use the `subscribeMessage` function off the `estate` object.

```typescript
await estate.subscribeMessageAsync(exerciseTracker, ExerciseAdded, (msg: ExerciseAdded) => {
        const exercise = msg.exercise;
        console.log(`${exercise.primaryKey} added`);
    });
```

[Example](https://github.com/EstateJS/exercise-tracker/blob/e84526a452630114fe70c6b75d35c4b78391672e/src/pages/exercises-list.tsx#L71)

The first argument is the source. This must match the source used to send the message. This this case it's a `ExerciseTrackerWorker` Worker proxy instance.  
The second argument is the `Message` derived type you'd like to subscribe to.  
The third argument is a callback function that takes an instance of the `Message` derived type that gets called when new messages are received.

:::tip Source
The source argument lets clients listen for Messages coming from different Workers or Data elements. For instance, if you had two different `ExerciseTrackerWorker` instances (different primaryKeys), you could listen for `ExerciseAdded` messages from one and not the other by specifying a different source.
:::

:::note
Workers cannot subscribe to Messages. Messages can, however, be passed to and returned from Worker methods.
:::

## Unsubscribing from Messages

It's a good idea to unsubscribe from Messages when you no longer need them. A good place to do this in a UI is your page's tear-down logic.

Unsubscribe from a Message using the `unsubscribeMessageAsync` function off the `estate` object.

```typescript
await estate.unsubscribeMessageAsync(exerciseTracker, ExerciseAdded);
```

[Example](https://github.com/EstateJS/exercise-tracker/blob/e84526a452630114fe70c6b75d35c4b78391672e/src/pages/exercises-list.tsx#L98)

The first argument is the source. This must match the source used when subscribing.
The second argument is the `Message` dervied type.

:::note Automatic Cleanup
By design, the Estate platform doesn't depend on client code acting properly. Estate will automatically delete all your Message subscriptions shortly after the `estate` object is collected by the client's Garbage Collector.
:::
