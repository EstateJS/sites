---
sidebar_label: 'Call a Worker from client code'
---

# Call a Worker from client code

The `sign-log-book.tsx` page is where people enter their first name and select a date to sign the log book. For this to function, we're going to create a new `Entry` instance and pass it to the `LogBook` worker.

## Use the `estate` object to get a `LogBook` worker proxy

10. Paste this code into **`src/pages/sign-log-book.tsx`** file where it says **//10**

```typescript
//10
const estate = useEstateClient();
const logBook = estate.getWorker(LogBook, "default");
```

:::note PrimaryKey
The second argument "default" is called the primaryKey. It could be any string and as long as all clients use the same one, they'll all share the same backend worker instance.
:::

## Create a new `Entry` and pass it to the Worker

We're going to create a new `Entry` instance and pass it to the worker when the Sign button is clicked. We need to update the `handleOnSubmit` function to make this happen.

11. Paste this code into **`src/pages/sign-log-book.tsx`** file where it says **//11**

```typescript
//11
const entry = new Entry(name!, date!);        
logBook.addEntry(entry)
    .then(() => {
            setRedirect(true);
        }).catch((reason: any) => {
            console.error(reason)
    });
```

## Call `getEntries` on the Worker

The `log-book-entries.tsx` page is what shows the list of people who have signed the log book.
We need to update it to ask our worker for the list of `Entries`. React's useEffect hook is a great place to call workers in the UI.

12. Paste this code into the `useEffect` where it says **//12**

```typescript
//12
logBook.getEntries()
    .then((values: Entry[]) => {
        setEntries(values);
    }).catch((reason: any) => {
        console.error(reason)
    });
```

This code calls the `getEntries()` method on the LogBook worker and returns a promise. When the promise returns, the values are stored in a React state variable that causes the UI to refresh and display its values.
