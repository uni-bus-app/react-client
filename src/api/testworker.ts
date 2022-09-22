/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

const stream = new ReadableStream({
  start(controller) {},
  pull(controller) {},
  cancel() {},
});

// self.postMessage({ stream });

export {};
