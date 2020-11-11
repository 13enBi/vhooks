const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

execSync('yarn build', { stdio: 'inherit' });
execSync('npm publish --access public --tag beta', { stdio: 'inherit', cwd: '../' });

console.log(`\n\n\n\n\nPublished @13enbi/vhooks:${JSON.parse(fs.readFileSync('../package.json')).version}`);
