---
sidebar_label: 'Create a Data element'
---

# Create a Data element

**Data** elements are used to persist structured data similar to how a database table or spreadsheet works except they're TypeScript and their properties are the data you want persisted.

Let's create an `Entry` data element to persist the `firstName` and `date` of people who sign the log book.

5. Paste this code into `log-book-service/index.ts` right below the import line:

```typescript
export class Entry extends Data {
    constructor(public firstName: string, public date: Date) {
        super(firstName);
    }
}
```
