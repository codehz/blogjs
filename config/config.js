"use strict";
const path = require('path');
const fs = require('fs');

if (process.env.BLOGJS_CONFIG) {
    module.exports = JSON.parse(fs.readFileSync(process.env.BLOGJS_CONFIG));
} else {
    let config = {
        logDir: path.join(__dirname, '..', 'log'),
        db: path.join(__dirname, '..', 'blog.db'),
        admin: { name: 'codehz', pass: '1234567' }
    };

    module.exports = config;
}
