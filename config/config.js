"use strict";
const path = require('path');
const fs = require('fs');

if (process.env.BLOGJS_CONFIG) {
    module.exports = fs.readFileSync(process.env.BLOGJS_CONFIG);
} else {
    let config = {
        logDir: path.join(__dirname, '..', 'log'),
        admin: { name: 'codehz', pass: '1234567' }
    };

    module.exports = config;
}
