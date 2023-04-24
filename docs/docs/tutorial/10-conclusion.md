---
sidebar_label: 'Complete'
---

# Run it

Now that our log book application is complete, we can see it in action

13. Start the front-end in development mode
```bash
$ npm run dev
```

14. Try it out
    1. Click "Sign" in the top bar
    2.  Enter a name and date
    3.  Click "Sign" again
    4.  You'll see the new signature and date you signed

The signatures will still exist after restarts because they're stored in the Estate database in the cloud, not the browser or any local cache.

## Conclusion

You've learned how to

1. Create, deploy, and communicate with Estate stateful serverless **Services**.
2. Use **Workers** inplace of microservices to manage data elements.
3. Create **Data** elements, persist them, and read them from inside a Worker and return them to the front-end.

Congratulations on finishing the tutorial!

:::tip More
There's more power to unlock, namely: real-time reactive/observable Data (think: real-time views, updated when other clients make changes), and real-time worker-to-client Messsages (think: chat room).  
Dig into the [Advanced Guides](guides/introduction) to continue your Estate adventure.
:::
