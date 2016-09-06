import * as path from 'path';
import * as fs from 'fs';
import * as async from 'async';

export function mkdirs(dirpath, mode, callback) {
   fs.exists(dirpath, function (exists) {
      if (exists) {
         callback(dirpath);
      } else {
         //尝试创建父目录，然后再创建当前目录
         mkdirs(path.dirname(dirpath), mode, function () {
            fs.mkdir(dirpath, mode, callback);
         });
      }
   });
};


export var scan = function (dir: string, suffix: string, callback: Function) {
   fs.readdir(dir, function (err, files) {
      var returnFiles = [];
      async.each(files, function (file, next) {
         var filePath = path.join(dir,file);
         fs.stat(filePath, function (err, stat) {
            if (err) { 
               return next(err);
            }
            if (stat.isDirectory()) {
               scan(filePath, suffix, function (err, results) {
                  if (err) {
                     return next(err);
                  }
                  returnFiles = returnFiles.concat(results);
                  next();
               })
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

export var scanSync = function (dir: string, suffix: string) {
   var files = fs.readdirSync(dir);
   var returnFiles = [];
   for (var i in files) {
      var file = files[i];
      var filePath = path.join(dir, file);
      var stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
         var results = scanSync(filePath, suffix);
         returnFiles = returnFiles.concat(results);
      } else if (stat.isFile()) {
         if (file.indexOf(suffix, file.length - suffix.length) !== -1) {
            returnFiles.push(filePath);
         }
      }
   }
   return returnFiles;
};

export var filterScanSync = function (dir: string, filter: Function) {
   var files = fs.readdirSync(dir);
   var returnFiles = [];
   for (var i in files) {
      var file = files[i];
      var filePath = path.join(dir, file);
      var stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
         var results = filterScanSync(filePath, filter);
         returnFiles = returnFiles.concat(results);
      } else if (stat.isFile()) {
         if (filter(file)) {
            returnFiles.push(filePath);
         }
      }
   }
   return returnFiles;
};