"use strict";
let mods = {};

module.exports = {
    mod: new Proxy(mods, {
            get(target, property) {
                return property in target ? target[property] : (target[property] = require(property));
            },

            set(target, property, value) {
                return (target[property] = value);
            }
        })
};