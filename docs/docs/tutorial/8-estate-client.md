---
sidebar_label: 'Use the Estate Client in Front-end code'
---

# Use the Estate Client in Front-end code

Front-end/client code uses functions on the `estate` object to interact with your service at runtime. Since this is a React project we'll need to use the `estate-react` package to get the `estate` object at runtime.

1. Paste this code to the top of `src/pages/sign-log-book.tsx` where it says **//1**

```typescript
//1
import {useEstateClient} from "estate-react";
import {Entry, LogBook} from 'log-book-service';
```

:::note strongly typed
The `Entry` and `LogBook` classes are code-generated based on the backend service code you wrote. If you add more types or rename these types, you'll need to update your imports accordingly.
:::

:::details Not just React
Estate is designed to work with any JavaScript front-end or backend framework. If you're not using React, you can use the `createEstateClient` function exported from your service module to get the `estate` object.
:::
