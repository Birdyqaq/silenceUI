'use strict';

const webComponents = require('..');
const assert = require('assert').strict;

assert.strictEqual(webComponents(), 'Hello from webComponents');
console.info('webComponents tests passed');
