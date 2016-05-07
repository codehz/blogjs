"use strict";

const DB = require('../lib/db');
const co = require('co');

const db = new DB('a.db');

// const delay = t => new Promise(r => setTimeout(r, t));

module.exports = co.wrap(function*() {
    console.log('INIT ARTICLE TABLE...');
    yield db._article.create()
        ._id('TEXT', { primary: true, unique: true })
        ._ctime('TIMESTAMP', { default: `CURRENT_TIMESTAMP` })
        ._mtime('TIMESTAMP', { default: `CURRENT_TIMESTAMP` })
        ._hide('BOOLEAN', { default: 1 })
        ._title('TEXT', { notnull: true })
        ._label('TEXT', { notnull: true })
        ._description('TEXT', { notnull: true })
        ._content('TEXT', { notnull: true })
        ._pic('TEXT')
        .build()
        .exec();
    console.log('INIT COMMENT TABLE...');
    yield db._comment.create()
        ._id('TEXT', { primary: true, unique: true })
        ._aid('TEXT', { foreign: 'article', foreign_field: 'id' })
        ._ctime('TIMESTAMP', { default: `CURRENT_TIMESTAMP` })
        ._hide('BOOLEAN', { default: '1' })
        ._ip('TEXT', { notnull: true })
        ._author('TEXT', { notnull: true })
        ._content('TEXT', { notnull: true })
        .build()
        .exec();
    console.log('DB INITED.');
    return db;
});
