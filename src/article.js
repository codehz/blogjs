"use strict";

module.exports = function(db) {
    const listArticleGuest = db._article.select('*')
        .where('hide=0')
        .autoLimit()
        .build();
    const listArticle = db._article.select('*')
        .autoLimit()
        .build();
    const getArticleGuest = db._article.select('*')
        .where('hide=0')
        .where('id=$aid')
        .build();
    const getArticle = db._article.select('*')
        .where('id=$aid')
        .build();
    const deleteArticle = db._article.delete()
        .where('id=$aid')
        .build();
    const postArticle = db._article.insert('title', 'description', 'label', 'content', 'pic', 'hide')
        .build();
    const updateArticle = db._article.update('title', 'description', 'label', 'content', 'pic', 'hide')
        .where('id=$aid')
        .build();
    const listCommentGuest = db._comment.select('*')
        .where('hide=0')
        .where('aid=$aid')
        .autoLimit()
        .build();
    const listComment = db._comment.select('*')
        .where('aid=$aid')
        .autoLimit()
        .build();
    const getCommentGuest = db._comment.select('*')
        .where('hide=0')
        .where('aid=$aid')
        .where('id=$cid')
        .build();
    const getComment = db._comment.select('*')
        .where('aid=$aid')
        .where('id=$cid')
        .build();
    const postComment = db._comment.insert('aid', 'ip', 'author', 'content')
        .build();
    const deleteComment = db._comment.delete()
        .where('aid=$aid')
        .where('id=$cid')
        .build();
    const switchCommentVisibility = db._comment.update('hide')
        .where('aid=$aid')
        .where('id=$cid')
        .build();
    const searchByTitleGuest = db._article.select('*')
        .where('hide=0')
        .where("title LIKE '%' || $title || '%'")
        .autoLimit()
        .build();
    const searchByTitle = db._article.select('*')
        .where("title LIKE '%' || $title || '%'")
        .autoLimit()
        .build();
    const searchByLabelGuest = db._article.select('*')
        .where('hide=0')
        .where("label LIKE '%' || $label || '%'")
        .autoLimit()
        .build();
    const searchByLabel = db._article.select('*')
        .where("label LIKE '%' || $label || '%'")
        .autoLimit()
        .build();
    const searchByContentGuest = db._article.select('*')
        .where('hide=0')
        .where("content LIKE '%' || $content || '%'")
        .autoLimit()
        .build();
    const searchByContent = db._article.select('*')
        .where("content LIKE '%' || $content || '%'")
        .autoLimit()
        .build();

    return {
        guest: {
            articles: { * get() {
                    const $offset = typeof this.query.offset === 'string' ? +this.query.offset : 0;
                    const $limit = 10;
                    console.log(typeof this.query.offset, $offset);
                    this.body = yield listArticleGuest.exec({ $offset, $limit });
                },
                $aid: { * get() {
                        this.body = yield getArticleGuest.exec({ $aid: this.aid });
                    },
                    comments: { * get() {
                            const $offset = typeof this.query.offset === 'string' ? +this.query.offset : 0;
                            const $limit = 10;
                            const $aid = this.aid;
                            this.body = yield listCommentGuest.exec({ $offset, $limit, $aid });
                        },
                        * post() {
                            const $aid = this.aid;
                            const $ip = this.request.ip;
                            const $author = this.request.body.author;
                            const $content = this.request.body.content;
                            this.body = yield postComment.exec({ $aid, $ip, $author, $content });
                        },
                        $cid: { * get() {
                                const $aid = this.aid;
                                const $cid = this.cid;
                                this.body = yield getCommentGuest.exec({ $aid, $cid });
                            },
                        }
                    }
                }
            },
            search: {
                title: { * get() {
                        const $offset = typeof this.query.offset === 'string' ? +this.query.offset : 0;
                        const $limit = 10;
                        const $title = this.query.keyword;
                        this.body = yield searchByTitleGuest.exec({ $offset, $limit, $title });
                    }
                },
                label: { * get() {
                        const $offset = typeof this.query.offset === 'string' ? +this.query.offset : 0;
                        const $limit = 10;
                        const $label = this.query.keyword;
                        this.body = yield searchByLabelGuest.exec({ $offset, $limit, $label });
                    }
                },
                content: { * get() {
                        const $offset = typeof this.query.offset === 'string' ? +this.query.offset : 0;
                        const $limit = 10;
                        const $content = this.query.keyword;
                        this.body = yield searchByContentGuest.exec({ $offset, $limit, $content });
                    }
                }
            }
        },
        admin: {
            articles: { * get() {
                    const $offset = typeof this.query.offset === 'string' ? +this.query.offset : 0;
                    const $limit = 10;
                    this.body = yield listArticle.exec({ $offset, $limit });
                },
                * post() {
                    // console.log(this.request.body);
                    const $title = this.request.body.title;
                    const $description = this.request.body.description;
                    const $label = this.request.body.label;
                    const $content = this.request.body.content;
                    const $pic = this.request.body.pic;
                    const $hide = typeof this.request.body.hide === 'string' && +this.request.body.hide ? 1 : 0;
                    this.body = yield postArticle.exec({ $title, $description, $label, $content, $pic, $hide });
                },
                $aid: { * get() {
                        this.body = yield getArticle.exec({ $aid: this.aid });
                    },
                    * put() {
                        const $aid = this.aid;
                        const $title = this.request.body.title;
                        const $description = this.request.body.description;
                        const $label = this.request.body.label;
                        const $content = this.request.body.content;
                        const $pic = this.request.body.pic;
                        const $hide = typeof this.request.body.hide === 'string' && +this.request.body.hide ? 1 : 0;
                        this.body = yield updateArticle.exec({ $aid, $title, $description, $label, $content, $pic, $hide });
                    },
                    * delete() {
                        this.body = yield deleteArticle.exec({ $aid: this.aid });
                    },
                    comments: { * get() {
                            const $offset = typeof this.query.offset === 'string' ? +this.query.offset : 0;
                            const $limit = 10;
                            const $aid = this.aid;
                            this.body = yield listComment.exec({ $offset, $limit, $aid });
                        },
                        * post() {
                            this.status = 501;
                            this.body = { err: 'Not Impl!' };
                        },
                        $cid: { * get() {
                                const $aid = this.aid;
                                const $cid = this.cid;
                                this.body = yield getComment.exec({ $aid, $cid });
                            },
                            * put() {
                                const $aid = this.aid;
                                const $cid = this.cid;
                                const $hide = typeof this.query.hide === 'string' && +this.query.hide ? 1 : 0;
                                this.body = yield switchCommentVisibility.exec({ $aid, $cid, $hide });
                            },
                            * delete() {
                                const $aid = this.aid;
                                const $cid = this.cid;
                                this.body = yield deleteComment.exec({ $aid, $cid });
                            }
                        }
                    }
                }
            },
            search: {
                title: { * get() {
                        const $offset = typeof this.query.offset === 'string' ? +this.query.offset : 0;
                        const $limit = 10;
                        const $title = this.query.keyword;
                        this.body = yield searchByTitle.exec({ $offset, $limit, $title });
                    }
                },
                label: { * get() {
                        const $offset = typeof this.query.offset === 'string' ? +this.query.offset : 0;
                        const $limit = 10;
                        const $label = this.query.keyword;
                        this.body = yield searchByLabel.exec({ $offset, $limit, $label });
                    }
                },
                content: { * get() {
                        const $offset = typeof this.query.offset === 'string' ? +this.query.offset : 0;
                        const $limit = 10;
                        const $content = this.query.keyword;
                        this.body = yield searchByContent.exec({ $offset, $limit, $content });
                    }
                }
            }
        }
    };
};
