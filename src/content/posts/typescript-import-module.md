---
title: Typescript import module
date: 2017-03-07 01:58:12
tags: [typescript]
image:
    url: 'https://source.unsplash.com/a-close-up-of-a-computer-screen-with-many-lines-of-code-on-it-NH0pmKaZeuk'
    alt: '#'
---

For **Typescript 2.0**,  which has the magic `@type` feature to manage typescript `.d.ts` definition files by `npm`, including module is much easy and elegant now!

Notice: This example uses typescript with `Gulp`. The prerequisite can be found on typescript official site - [Typescript with Gulp](https://www.typescriptlang.org/docs/handbook/gulp.html).

## Download Module
Install the module you want to use by `npm`.
``` bash
npm install --save bootstrap @types/bootstrap
```
The `@types/bootstrap` will tell `npm` to also collect the typescript definition of bootstrap, and place it under the `@type` directory under `node_modules`.

## Include Module
In your `ts` script where you want to include `bootstrap`, just add the line:
```javascript
import "bootstrap"
```
Then it is done!
