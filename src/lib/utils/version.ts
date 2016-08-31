var path = require('path');
var fs = require('fs');
var _version;

function _getVersionString(){
   var time:any = new Date();
   var year:any = time.getFullYear() + '';

   year = year.substring(2);

   var mouth = (time.getMonth() + 1);
   if(mouth < 10){
      mouth = '0' + mouth;
   }
   var date = time.getDate();
   if(date < 10){
      date = '0' + date
   }
   var hour = time.getHours();
   if(hour < 10){
      hour = '0' + hour;
   }
   return '' + year + mouth + date  + hour;
}

function getVersionString(){
   if(!_version){
      _version = _getVersionString()
   }
   return _version;
}

function replaceFileContent(file){
   //console.log(file);
   var content = fs.readFileSync(file,'utf8');
   //console.log(content)
   var lines = content.split('\n');
   var newContent = '';
   for(var i=0;i<lines.length;i++){
      var line = lines[i];
      if(i!= lines.length -1){
         newContent += replaceLine(line) + '\n';
      }
   }
   fs.writeFileSync(file,newContent,'utf8');
}
var version = getVersionString();
function replaceLine(line){
   var loweredLine = line.toLocaleLowerCase();
   if(/.*<script.*src=.*script>/.test(loweredLine)){
      line = replaceScriptImportLine(line);
   }else if(/.*<link.*href=.*>/.test(loweredLine)){
      line = replaceStyleImportLine(line);
   }else if(/xhr\.open.*"(.*\.jr)".*/.test(loweredLine)){
      line = replaceJRImportLine(line);
   }else if(/VERSION:\s*(\'.*\')\s*,/.test(line)){
      line = replaceConfigVersionLine(line);
   }

   return line;
}

function replaceJRImportLine(line){
   var reg = /"(.*\.jr)"/;
   if(reg.test(line)){
      line = line.replace(/"(.*\.jr)"/g,function(){
         var p1 = arguments[1];
         return '"' + p1 + '?version=' + version + '"'; 
      })
   }
   return line;
}

function replaceStyleImportLine(line){
   var reg = /href="(.*)".*type=/;
   if(reg.test(line)){
      line = line.replace(/href="(.*)".*type=/g,function(){
         var p1 = arguments[1];
         return 'href="' + p1 + '?version=' + version + '" type='; 
      })
   }
   return line;
}

function replaceScriptImportLine(line){
   var reg = /src="(.*)"/;
   if(reg.test(line)){
      line = line.replace(/src="(.*)"/g,function(){
         var p1 = arguments[1];
         return 'src="' + p1 + '?version=' + version + '"'; 
      })
   }
   return line;
}

function replaceConfigVersionLine(line){
   var reg = /(\'.*\')/;
    if(reg.test(line)){
      line = line.replace(/(\'.*\')/g,function(){
         var p1 = arguments[1];
         return "'" + version + "'"; 
      })
   }
   return line;
}

export function addVersionNumberToFiles(files){
   for(var i in files){
      var file = files[i];
      replaceFileContent(file);
   }
}