const napi = require('node-addon-api').include;
let p = napi || '';
// remove leading -I and surrounding quotes if present
p = p.replace(/^(-I\s*)?/, '');
if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
    p = p.slice(1, -1);
}
console.log(p);
