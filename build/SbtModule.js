"use strict";
const Datastore = require('nedb');
const path = require('path');
var dbFile = path.join(process.cwd(), '.sbt', 'module');
var db = new Datastore({ filename: dbFile });
db.loadDatabase(function (err) {
});
class SbtModule {
    constructor(config) {
        this.name = config.name;
        this.deps = config.deps;
    }
    getModifyTime() {
        return this._modifyTime || 0;
    }
    updateModifyTime() {
        this._modifyTime = new Date().getTime();
    }
    getComplieTime() {
        return this._complieTime || -1;
    }
    updateComplieTime() {
        this._complieTime = new Date().getTime();
    }
    isDirty() {
        return this.getComplieTime() < this.getModifyTime();
    }
}
exports.SbtModule = SbtModule;
//# sourceMappingURL=SbtModule.js.map