const fs  = require('node:fs');
const path = require('node:path');

const environmentVariables = {};
const localEnvPath = path.resolve(__dirname, '.env-cmdrc.local.json');

if (fs.existsSync(localEnvPath)) {
  Object.assign(environmentVariables, require(localEnvPath));
}

module.exports = environmentVariables;
