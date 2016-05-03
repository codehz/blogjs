"use strict";

// const Global = require('../global.js');
const Router = require('koa-router');
const ArticleApi = require('./article.js');
const auth = require('koa-basic-auth');

const path2tree = (obj, restpath) => (restpath.length ? path2tree(obj[restpath[0]], restpath.splice(1)) : obj);

const regRouter = (router, src) => (method, path) => (router[method](path, path2tree(src, path.split('/')
    .splice(1)
    .map(str => str.replace(/:/, '$')))[method]), regRouter(router, src));

module.exports = function(app, db, config) {
    let articleApi = ArticleApi(db);
    let rootRouter = new Router();
    let adminRouter = new Router();
    rootRouter.param('aid', function*(aid, next) {
            this.aid = aid;
            yield next;
        })
        .param('cid', function*(cid, next) {
            this.cid = cid;
            yield next;
        });
    adminRouter.use(function*(next) {
        try {
            yield next;
        } catch (err) {
            if (401 == err.status) {
                this.status = 401;
                this.set('WWW-Authenticate', 'Basic');
                this.body = { err: 'Need Auth!' };
            } else {
                throw err;
            }
        }
    }, auth(config.admin));
    regRouter(rootRouter, articleApi.guest)
        ('get', '/articles')
        ('get', '/search/title')
        ('get', '/search/label')
        ('get', '/search/content')
        ('get', '/articles/nums')
        ('get', '/articles/:aid')
        ('get', '/articles/:aid/comments')
        ('get', '/articles/:aid/comments/:cid')
        ('post', '/articles/:aid/comments');
    regRouter(adminRouter, articleApi.admin)
        ('get', '/articles')
        ('get', '/search/title')
        ('get', '/search/label')
        ('get', '/search/content')
        ('get', '/articles/nums')
        ('get', '/articles/:aid')
        ('get', '/articles/:aid/comments')
        ('get', '/articles/:aid/comments/:cid')
        ('put', '/articles/:aid/comments/:cid')
        ('post', '/articles/:aid/comments')
        ('delete', '/articles/:aid/comments/:cid')
        ('delete', '/articles/:aid')
        ('put', '/articles/:aid')
        ('post', '/articles');

    rootRouter.use('/admin', adminRouter.routes(), adminRouter.allowedMethods());
    app.use(rootRouter.routes(), rootRouter.allowedMethods());
};
