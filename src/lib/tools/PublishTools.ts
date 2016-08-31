import {BuildTools} from './BuildTools'
import * as ts from "typescript";
import * as fs from 'fs';
import * as path from 'path';
var fsExtra = require('fs-extra')
var UglifyJS = require("uglify-js");
var lzma = require('lzma');
//var cc = require('closure-compiler');
import {addVersionNumberToFiles} from '../utils/version'
export class PublishTools extends BuildTools {

   public prepareComplieOptions() {
      this._tsComplieOptions = {
         target: ts.ScriptTarget.ES5,
         module: ts.ModuleKind.AMD,
         allowJs: false,
         noImplicitAny: false,
         removeComments: true,
         noLib: false,
         preserveConstEnums: true,
         suppressImplicitAnyIndexErrors: true,
         emitDecoratorMetadata: true,
         experimentalDecorators: true,
         sourceMap: false,
         noImplicitUseStrict: true,
         outFile: './build/' + this.getModuleName() + '.js',
         jsx: ts.JsxEmit.React
      }

   }

   public publish() {
      //编译js文件
      this.complie();
      //合并js,生成[module].all.js文件
      this.concat();
      //全局剔除 assert debugger log之类
      this.filter();
      //压缩、混淆js文件 生成[module].all.min.js文件 
      this.minifiy(() => {
         //二进制压缩 
         this.binaryCompress(() => {
            //拷贝资源 copy  source target
            this.copyResource();
            //添加版本号 
            this.addVersionNumber();
         });
      });


   }

   public getPublishConfig() {
      var config = this.getModuleConfig(this.getModuleName());
      return config.publish;
   }

   private concat() {
      var config = this.getPublishConfig();
      var enabled = config.concat === false ? false : true;
      if (enabled) {
         if (config.beforeConcat instanceof Function) {
            config.beforeConcat();
         }
         var concatFiles = config.concatFiles;
         var allStr = '';
         for (var i in concatFiles) {
            var file = concatFiles[i];
            var content = this.readFile(file);
            allStr += content;
            allStr += '\n';
         }
         this.writeFile(this.getConcatedFile(), allStr);

         if (config.afterConcat instanceof Function) {
            config.afterConcat();
         }
      }
   }

   private getConcatedFile() {
      return path.join('build', this.getModuleName() + '.all.js')
   }

   private getFiltedFile() {
      return path.join('build', this.getModuleName() + '.filted.js')
   }

   private getMinifyedFile() {
      return path.join('build', this.getModuleName() + '.min.js')
   }

   private getBinaryedFile() {
      return path.join('build', this.getModuleName() + '.jr');
   }

   private filter() {
      var config = this.getPublishConfig();
      var enabled = config.filter === false ? false : true;
      if (enabled && config.filterFunction) {
         if (config.beforeFliter instanceof Function) {
            config.beforeFliter();
         }
         var content = this.readFile(this.getConcatedFile());
         var lines = content.split('\n');
         var newContent = '';
         for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (i != lines.length - 1) {
               newContent += config.filterFunction(line) + '\n';
            } else {
               newContent += config.filterFunction(line);
            }
         }
         this.writeFile(this.getFiltedFile(), newContent);
         if (config.afterFliter instanceof Function) {
            config.afterFliter();
         }
      }

   }

   private minifiy(cb) {
      var config = this.getPublishConfig();
      var enabled = config.minify === false ? false : true;
      if (enabled) {
         if (config.beforeFliter instanceof Function) {
            config.beforeFliter();
         }
         var result = UglifyJS.minify([this.getFiltedFile()], {
            compress: {
               dead_code: true,
               global_defs: {
                  DEBUG: false
               }
            },
            mangle: { toplevel: true },
            mangleProperties: false
         });
         this.writeFile(this.getMinifyedFile(), result.code);

         if (config.afterFliter instanceof Function) {
            config.afterFliter();
         }
         cb();

         // var options =
         //    {
         //       language_in: "ECMASCRIPT6",
         //       language_out: "ECMASCRIPT5",
         //       warning_level: 'QUIET'
         //    }
         // var minfiyedFile = this.getMinifyedFile();
         // function aftercompile(err, stdout, stderr) {
         //    if (err) throw err
         //    var mycompiledcode = stdout
         //    fs.writeFileSync(minfiyedFile, mycompiledcode)
         //    if (config.afterFliter instanceof Function) {
         //       config.afterFliter();
         //    }
         //    cb();
         // }
         // var code = this.readFile(this.getFiltedFile());
         // cc.compile(code, options, aftercompile)


      }
   }

   private binaryCompress(cb) {
      var config = this.getPublishConfig();
      var enabled = config.binaryCompress === false ? false : true;
      var binaryedFile = this.getBinaryedFile();
      if (enabled) {
         if (config.beforeBinrayCompress) {
            config.beforeBinrayCompress();
         }
         function onCompressProgress(percent) {
            console.log('percent: ' + Math.round(percent * 10000) / 100 + '%');
         }
         function onCompressFinish(result, error) {
            fs.writeFileSync(binaryedFile, new Buffer(result), { encoding: 'hex' });
            console.log('Write output file. (file=' + binaryedFile + ', length=' + result.length + ')');
            if (config.afterBinrayCompress) {
               config.afterBinrayCompress();
            }
            cb();
         }
         var code = fs.readFileSync(this.getMinifyedFile())
         lzma.compress(code, 1, onCompressFinish, onCompressProgress)
      }
   }

   private copyResource() {
      var config = this.getPublishConfig();
      var enabled = config.copyResource === false ? false : true;
      if (enabled && config.copyResourceActions) {
         if(config.beforeCopyResource instanceof Function){
            config.beforeCopyResource();
         }
         for (var i in config.copyResourceActions) {
            var action = config.copyResourceActions[i]
            fsExtra.copySync(action.from, action.to)
         }
         if(config.afterCompyResource instanceof Function){
            config.afterCompyResource();
         }
      }

   }

   private addVersionNumber() {
      var config = this.getPublishConfig();
      var enabled = config.addVersionNumber === false ? false : true;
      if (enabled && config.needVersionFiles) {
         if(config.beforeAddVersionNumber instanceof Function){
            config.beforeAddVersionNumber();
         }
         addVersionNumberToFiles(config.needVersionFiles);
         if(config.afterAddVersionNumber instanceof Function){
            config.afterAddVersionNumber();
         }
      }
   }

   private readFile(file) {
      return fs.readFileSync(file, 'utf-8');
   }

   private writeFile(file, content) {
      fs.writeFileSync(file, content, 'utf-8');
   }
}