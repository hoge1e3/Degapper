s=sys.fileText("C:/bin/Dropbox/cej1203nishidaLangedu/grammar.txt");
s+="\nend:";
var defs=[];
var curDef;
s.split(/\r?\n/).forEach(function (line) {
    line=line.replace(/^\s*/,"").replace(/\s*$/,"");
    if (line.match(/:$/)) {
        curDef={  name: RegExp.leftContext, ors:[] };
        defs.push(curDef);
    } else {

    }
});
defs.forEach(function (def) {
    console.log(def.name);
})