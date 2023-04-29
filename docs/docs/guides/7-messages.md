---
sidebar_label: 'Messages'
sidebar_position: 5
---

This page is a work in progress. Check back tomorrow (Sunday) afternoon.

<!-- # Message - built-in SSE

Messages are an implementation of the Server-Sent-Events (SSE) concept used by socket.io and SignalR except built into Estate as a first-class concept. Messages are an efficient way to send data from the cloud (“Server”) to any number of clients without the clients polling a service.

## Writing & Sending

Writing, sending, and consuming messages is easy. To write a Message simply extend the Message abstract base class. Unlike the two other base classes, Messages _do not_ have a primaryKey (see below.). Then at runtime, from inside a service method call create an instance of your new Message using the new operator. Then pass that object to `system.sendMessage(...)`. Any properties you define/set on the Message object will be transported to all clients that have registered to receive messages of that class type. Note, presently Messages cannot be fired directly from clients.

## Short lived, never saved

The Message constructor does not take a primaryKey because Messages do not have datastores- their object instances are _transient_. Meaning, they are to be created, fired, and handled by clients but never saved or persisted. Think of a message instance as a notification that contains all relevant metadata about what happened to cause the message to be sent.

## Message properties provide context

Along with all standard JS/TS types (Map, Set, Array, bool, string, etc..), Data and Service instances can be Message properties so you’re free to include all the relevant context when you send message instances. For example, a `UserAdded` message may include a property `user` that has an instance of the `User` (Data) that was added.

## Receiving messages on clients

This diagram illustrates a message being sent from a service instance and handled by client code.  

Clients must subscribe to receive messages. To subscribe a client must pass three arguments:

* A source Data or Service (in the above example, `this` is the current instance of MyService)
* The type of the message (`MyMessage` above)
* A function taking a single argument that will be called with the message instance when a message is recieved

After a client subscribes and until the client unsubscribes (or shuts down), it will receive messages
every time `system.sendMessage(...)` is called with the same source and message type. -->