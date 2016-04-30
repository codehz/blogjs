"use strict";

const koa = require('koa');
const app = new koa();
const config = require('../config/config.js');
const appRouter = require('../src/router.js');
const initDB = require('../src/init_db.js');
const Logger = require('mini-logger');
const onerror = require('koa-onerror');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const validator = require('koa-validator');
// const router = require('koa-router');
const json = require('koa-json');
require('koa-qs')(app, 'first');
const logger = Logger({
    dir: config.logDir,
    format: 'YYYY-MM-DD-[{category}][.log]'
});
app.proxy = true;
app.use(function *(next){
    if (!this.config) this.config = config;
    yield next;
});

//router use : this.logger.error(new Error(''))
app.context.logger = logger;
onerror(app);
app.use(session(app));
app.use(bodyParser());
app.use(validator());
// app.use(router(app));
app.use(json());

console.log('starting...');

initDB().then(db => {
    appRouter(app, db);

    console.log('started');
    app.listen(3000);
});
