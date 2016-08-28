"use strict";
const path = require('path');
const fs = require('fs');
const async = require('async');
function mkdirs(dirpath, mode, callback) {
    fs.exists(dirpath, function (exists) {
        if (exists) {
            callback(dirpath);
        }
        else {
            mkdirs(path.dirname(dirpath), mode, function () {
                fs.mkdir(dirpath, mode, callback);
            });
        }
    });
}
exports.mkdirs = mkdirs;
;
exports.scan = function (dir, suffix, callback) {
    fs.readdir(dir, function (err, files) {
        var returnFiles = [];
        async.each(files, function (file, next) {
            var filePath = path.join(dir, file);
            fs.stat(filePath, function (err, stat) {
                if (err) {
                    return next(err);
                }
                if (stat.isDirectory()) {
                    exports.scan(filePath, suffix, function (err, results) {
                        if (err) {
                            return next(err);
                        }
                        returnFiles = returnFiles.concat(results);
                        next();
                    });
                }
                else if (stat.isFile()) {
                    if (file.indexOf(suffix, file.length - suffix.length) !== -1) {
                        returnFiles.push(filePath);
                    }
                    next();
                }
            });
        }, function (err) {
            callback(err, returnFiles);
        });
    });
};
exports.scanSync = function (dir, suffix) {
    var files = fs.readdirSync(dir);
    var returnFiles = [];
    for (var i in files) {
        var file = files[i];
        var filePath = path.join(dir, file);
        var stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            var results = exports.scanSync(filePath, suffix);
            returnFiles = returnFiles.concat(results);
        }
        else if (stat.isFile()) {
            if (file.indexOf(suffix, file.length - suffix.length) !== -1) {
                returnFiles.push(filePath);
            }
        }
    }
    return returnFiles;
};
//# sourceMappingURL=FileUtil.js.map