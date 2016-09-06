import * as path from 'path'
export class TsSourceFile {
   public static tsFileTypes = ['.ts', '.tsx'];
   public static isTsSourceFile(file): boolean  {
      var ext = path.extname(file);
      if (this.tsFileTypes.indexOf(ext) > -1) {
         return true;
      } else {
         return false;
      }
   }
} 