const fs = require('fs');
const assert = require('assert');

const html = fs.readFileSync('index.html', 'utf8');
assert(html.includes('<title>ParallarXiv</title>'));
console.log('Tests passed');
