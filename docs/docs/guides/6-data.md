---
sidebar_label: 'Data'
sidebar_position: 5
---

This page is a work in progress. Check back tomorrow or Friday.

<!--
# Data - intelligent data objects

Similar to a database table, you create Data derived classes when you want to persist, use, and share structured data.

## Properties

Your Data can contain any number of JavaScript properties with any name, just use normal this.propertyName syntax when getting/setting/deleting values. All built-in JavaScript property types are supported including Map, Set, and Array. You can create new properties in any Data method, not just the constructor.

## Creating new objects

You create new Data object instances the same way you create instances of other TypeScript classes: use the new operator. All Data have a primaryKey that, along with the class type, uniquely identifies the object instance. The primaryKey is an opaque 1 to 1024 character string and must be supplied to super in your class’s constructor.

## Retrieving existing data objects from the client

Data instances can be retrieved from their datastore on the client using this syntax:

```typescript
let myData = await database.getDataAsync(MyData,"a primary key");
```

The first argument is the Data class you’d like to retrieve and the second is the primary key. This will load the object into local client memory where it can be displayed in a UI element or modified just like any other JavaScript object.

## Retrieving existing data objects from a service in the database

Data instances can also be retrieved from their datastore while inside a Service’s service method call with this syntax:

```typescript
let myData = system.getData(MyData,"a primary key");
```

The arguments are the same as the clients-side example above. This loads the object into the database memory for use during the service method call. You can make changes or use the object like any other JavaScript object from inside the service and even return it to the client (using a return statement).

## Manually Saved

Data object property changes must be saved manually from inside a service method (as shown above) or
directly from the client using the `database.saveDataAsync` function. Though the Data instances themselves are stored in their datastore, they can be kept track of (or “indexed” in database terms) by Services using standard JS/TS collections such as Map, Set, and Array. This allows you to build powerful queries by writing plain JS/TS instead of being forced to learn a dedicated query language.

## In-Proc Method Calls

Like Services, Data can contain methods but when a client calls them they’ll execute directly on
the client. However, if a service calls a Data’s method it will execute in the database. This is an
essential feature for writing getter/setter style business logic such as enforcing a property’s type or
having a minimum string length.

### Remotely observable

Data instances are client observable: A client can “watch” a given Data instance for changes made by
other clients/services and then retrieve those changes in real-time. You accomplish this from a client by
first subscribing to updates with `database.subscribeUpdatesAsync` and then attaching a handler
function with `database.addUpdateListener`. The example application (link below) has a
demonstration of this functionality.

### Consistent, transparently versioned

Data are transparently versioned and kept consistent using transactions and optimistic concurrency. They can be passed to and returned from Service methods and saved as part of other Data instances. In fact, there’s a special system method just for saving an entire graph of Data
instances: `system.saveDataGraphs(data...)` which takes any number of Data instances and saves them along with all the Data instances they refer to (and so on.)

### Data + Services = Stateful Serverless App & Data Tier

Putting everything together it would look something like the above diagram. Note that the Data and Service base classes require a single argument: the primaryKey value. See the User constructor’s super(fullName) call where it runs some business logic on the fullName constructor argument before passing it to the Data base class’s constructor (in native code.)  

As previously noted, Service instances are created on first use. So the first time any servicemethod, in this case addUserAsync is called, a new MyService object instance is created with the primary key “default” (because that’s what the client specified in the call to `database.getService(MyService, "default")`.  

If multiple users access the website they’ll get the very same “default” MyService instance with the very same object state (because service instances are singletons.) Clients can share data with each other by sharing it with the service and providing a method that returns the property. Allowing clients to interact with each other brings us to the final core concept, Server-Sent-Events. -->
