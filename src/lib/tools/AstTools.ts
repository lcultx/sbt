import {SbtModule} from '../types/SbtModule';
import * as fs from 'fs';
import {BaseTools} from './BaseTools';
export class AstTools extends BaseTools {
   public sbtModule: SbtModule;

   private propertys: Array<string> = [];
   private methods: Array<string> = [];

   public parser(name: string) {
      this.sbtModule = new SbtModule(this.getModuleConfig(name));
      var tsFiles = this.sbtModule.getAllTsFiles();


      var astConfig = this.sbtModule.getAstConfig();
      for (var i in tsFiles) {
         var file = tsFiles[i];
         this.parserFile(file);
      }
   }

   private parserFile(file) {
      var content = fs.readFileSync(file, 'utf-8');
      this.parserFileContent(content);
   }

   private parserFileContent(text) {
      var lines = text.split('\n');
      for (var i in lines) {
         var line = lines[i];
         this.parseLine(line)
      }
   } 

   private mreg = /[^}]*?\s+([^=:\(\()@\.]*)\s+{/;
   private preg = /(public)|(private)/;
   private parseLine(line: string) {
      if (line.indexOf(' else ') > -1 || line.indexOf(' class ') > -1 || line.indexOf(' return ') > -1
         || line.indexOf(' as ') > -1
      ) {
         return;
      }
      if (this.mreg.test(line)) {
         var rl = this.mreg.exec(line);

         var name = rl[1]
         if (name) {
            console.log(line)
            console.log(name);

            this.methods.push(name);
         }

      }
   }


}