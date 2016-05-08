"use strict";

const koa = require('koa');
const app = new koa();
const config = require('../config/config.js');
const appRouter = require('../src/router.js');
const initDB = require('../src/init_db.js');
const logger = require('koa-logger');
const limit = require('koa-limit');
const onerror = require('koa-onerror');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const validator = require('koa-validator');
const cors = require('koa-cors');
// const router = require('koa-router');
const json = require('koa-json');
require('koa-qs')(app, 'first');
app.proxy = true;
app.use(function*(next) {
    if (!this.config) this.config = config;
    yield next;
});

//router use : this.logger.error(new Error(''))
// app.context.logger = logger;
onerror(app);
app.use(logger());
app.use(limit({
    limit: 1000,
    interval: 1000 * 60 * 30
}));
app.use(session(app));
app.use(bodyParser());
app.use(validator());
app.use(cors({
    origin: '*'
}));
// app.use(router(app));
app.use(json());

console.log('starting...');

initDB()
    .then(db => {
        appRouter(app, db, config);
    });
