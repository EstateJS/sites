---
sidebar_label: 'Services'
---
# Your backend is a Service

Estate hosts cloud backends in always-on, _internet-accessible systems_ called **Services** that your applications can access at runtime using automatically generated client code.

## Service Details

Services:

* Are serverless: No DevOps or management overhead
* Are sandboxed environments with isolated datastores
* Are fully programmable using pure, modern object-oriented TypeScript syntax
* Can handle any number of requests at the same time because unlike Node.js, they’re **multi-threaded** (without the need to write thread-aware code)
* Are very fast: most requests are handled in under 200μs which is 1/5th of 1 millisecond (not including network round-trip)
* Are managed using a CLI application so it’s perfect for efficiency-focused software engineers

Service internals:

Each service is composed of two layers: **the ???** and the **???.**

## the database

((RE-WRITE THIS because it's not  necessary to explain the 'two parts' of a service))

The services and objects you author live in **the database** at runtime. the database is an _Internet-connected Inversion of Control container_ (**IIoC**). Similar to existing IoC containers like Angular, Aurelia, or InversifyJS, except its objects live outside the lifecycle of a given client- they live forever (or until you delete them) and, most importantly, can be referenced directly over the Internet.

## Database Kernel

The Database Kernel is an object-oriented **cloud operating system** that manages and provides internet access to the database at runtime.  

The Database Kernel handles the following things for the database:

* Request routing
* Task & thread management
* Real-time networking (WebSockets over HTTPS/TLS)
* Transactional, ACID compliant data storage for services and objects (aka datastores) using the Unit-of-Work methodology
* Hardware monitoring and fault mitigation
* Usage-based autoscaling and provisioning
* Datastore synchronization/replication and fault-tolerance (Business-class subscriptions only)

The Database Kernel is programmable by Database developers via the `estate-runtime` TypeScript library stub.
This library is created when the `estate init` command is run.

## Hosting in the database

Hosting a class in the database is easy. Simply extend one of three abstract base classes: **Service**, **Data**, or **Message** found in the `estate-runtime` library. Which abstract class you choose determines how instances of that class will behave in the database and how clients use them at runtime.