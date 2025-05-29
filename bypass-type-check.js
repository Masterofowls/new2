const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJsonPath = path.resolve('package.json');
const packageJson = require(packageJsonPath);

// Backup the original build script
const originalBuildScript = packageJson.scripts.build;

// Modify the build script to ignore type checking and linting
packageJson.scripts.build = 'next build --no-lint --no-typecheck';

// Write the modified package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Build script modified to bypass type checking and linting.');
console.log('Original build script:', originalBuildScript);
console.log('Modified build script:', packageJson.scripts.build);
console.log('You can now run "npm run build" to build the project without type checking and linting.');
