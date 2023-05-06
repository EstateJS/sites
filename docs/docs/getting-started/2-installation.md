---
sidebar_label: 'Installation'
---

# Installation

:::tip
Use the [Fast Track](/#fast-track) to understand Estate in *15 minutes*⏱!  
Use the [Playground](getting-started/playground) to try Estate directly in your browser!
:::

## Developer Tools

To write code that runs on the platform you must install the development tools npm package.

### Requirements

[Node.js](https://nodejs.org/en/download/) v16 and above (which can be checked with `node -v`). You can use [nvm](https://github.com/nvm-sh/nvm) for managing multiple Node versions on a single machine.

1. Install Developer Tools

Installing the development tools globally is recommended but not required.

```bash
npm install -g estate-tools
```

Alternatively you can install them as a dev dependency.

```bash
npm install --saveDev estate-tools
```

2. Download the tutorial locally

```bash
$ npx tiged estatejs/estate/tutorial tutorial
$ cd tutorial
```

The `tutorial` directory now contains the front-end NPM project which is the root directory of the tutorial.

You're ready to continue with the [Tutorial](/tutorial/overview).
