---
sidebar_label: 'Create a Data element'
---

# Create a Data element

**Data** elements are used to persist structured data similar to a database table or spreadsheet, except they're TypeScript and their properties are the data you want persisted.

Let's create an `Entry` data element to persist the `firstName` and `date` of people who sign the log book.

4. Paste this code into `service/index.ts` right below the import line where it says **//4**.

```typescript
//4
export class Entry extends Data {
    constructor(public firstName: string, public date: Date) {
        super(firstName);
    }
}
```
