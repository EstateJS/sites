---
sidebar_label: 'Create a Worker'
---

# Create a Worker

**Workers** are like microservices that retain their state between calls (i.e. stateful).

Let's create a `LogBook` worker to keep track of who signs the log book.

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
