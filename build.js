const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
fs.mkdirSync(distDir, { recursive: true });
fs.copyFileSync('index.html', path.join(distDir, 'index.html'));
console.log('Build complete');
