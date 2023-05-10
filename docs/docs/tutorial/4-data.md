---
sidebar_label: 'Create a Data element'
---

# Create a Data element

## Data Elements

**Data** elements are TypeScript classes used to persist structured data similar to a database table or spreadsheet.  

To make a new Data element you write a new class that extends from the `Data` class found in `estate-runtime`. Each `Data` you write in your service code will get its own server-side datastore where all instances and properties will be kept when they're saved.

Each `Data` element has a `primaryKey` property whose value must be unique **to the class** type. 

:::info example
If you have two types, `Foo` and `Bar`, they could have the same `primaryKey` and point to different instances since they're different class types. However, two instances of the `Foo` type must have different `primaryKey` values.
:::

The `Data` element's `constructor` is used to set initial property values. The constructor can take any number and type of arguments. However, by the end of the constructor you must pass a string to `super` which becomes the `Data` element's `primaryKey`. This value can't be changed.

## Create a log book `Entry`

1. Paste the `Entry` class' code into `service/index.ts` right below the import line where it says **//4**.

```typescript
//4
export class Entry extends Data {
    constructor(public firstName: string, public date: Date) {
        super(firstName);
    }
}
```

The `firstName` and `date` properties are passed to the `constructor` and since they're `public` they become properties (not just constructor arguments).  
The `firstName` property is then passed to `super` to make the `Entry`'s `primaryKey` equal to the `firstName` property. This means all `Entry` instances must have a unique `firstName`.  
