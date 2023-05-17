---
sidebar_label: 'Create a Worker'
---

# Create a Worker

## Workers

**Workers** work like long-lived TypeScript objects that live in the cloud that you can call methods on remotely, similar in function to a stateful microservice. Workers are an ideal place to keep private server-side logic like a game server or an account management system.

To make a new Worker you write a class that extends the `Worker` class. Each Worker you write gets its own server-side datastore.  

## Server-side Properties

Workers can contain any number and type of properties but they only exist server-side and aren't visible to client code. Client code can access Worker properties indirectly by calling the Worker's methods. This encapsulation let you to write secure logic that controls how the Worker's state is changed over time.

:::note calling workers
We'll cover how to call a worker from client code later in this tutorial but, in short, clients use auto-generated proxy objects that have the same method signatures as the Worker's class.
:::

Worker properties are automatically saved after each method call. This makes them a great place to keep track of your `Data` elements using JavaScript Set/Map Worker properties.

The Worker's constructor must take a single string property named `primaryKey` and the value must be passed to `super`.

Let's create a `LogBook` worker to keep track of the `Entry` data elements.

5. Paste this code into `service/index.ts` after the `Entry` class where it says **//5**.

```typescript
//5
export class LogBook extends Worker {
    private _entriesIndex: Set<string>;
    constructor(primaryKey: string) {
        super(primaryKey);
        this._entriesIndex = new Set();
    }
    addEntry(entry: Entry) : void {
        if(this._entriesIndex.add(entry.primaryKey)) {
            saveData(entry);
        } else {
            throw new Error('duplicate entry');
        }
    }
    getEntries() : Entry[] {
        const entries: Entry[] = [];
        for(const pk of this._entriesIndex.values()) {
            entries.push(getData(Entry, pk));
        }
        return entries;
    }
}
```
