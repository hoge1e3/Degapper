s=sys.fileText("C:/bin/Dropbox/cej1203nishidaLangedu/grammar.txt");
sys.load("js/parsec2.js");
sys.load("js/Grammar.js");
sys.load("js/XMLBuffer.js");

KRGrammar=function () {
    var $={};
    var sp=Parsec2.StringParser;
    var p=Parsec2.Parser;
    var g=Grammar();
    var space=sp.reg(/^ */);
    function tk(r, f) {
        var pat;
        var fst;
        if (typeof r=="string") {
            pat=sp.str(r);
            if (r.length>0) fst=r.substring(0,1);
        } else {
            pat=sp.reg(r);
        }
        var res=space.and(pat).ret(function(a, b) {
            if (typeof f == "function")
                return f(b);
            if (typeof f == "number")
                return b[f];
            var res={};
            res.pos=b.pos;
            res.len=b.len;
            res.text=b.src.str.substring(res.pos, res.pos+res.len);
            res.toString=function (){
                return this.text;//+"("+this.pos+")";
            };
            return res;
        });
        if (fst) res.first(space, fst);
        return res.setName(r+"").profile();
    };
    var br=sp.reg(/^(\t*\s*)*\r?\n/);
    var symbol=g("symbol").ands(tk(/^[a-zA-Z0-9][a-zA-Z0-9\-]*/)).ret("-name");
    var strconst=g("strconst").ands(tk(/^[^?:a-zA-Z'+*]+/)).ret("text");
    var quote=g("quote").ands(tk(/^'[^\s]+/)).ret(function (r) {
        return {type:"strconst", text: r.substring(1)};
    });
    var elem=g("elem").ors(symbol, quote, strconst);
    var opt=g("opt").ors(tk("?opt"),tk("+"), tk("*"));
    var elemopt=g("elemopt").ands(elem, opt.rep0() ).ret("elem","opts");
    var sep=g("sep").ands(tk("SEP"), elem, elem).ret(null, sep, elem);
    var seq=g("seq").ors(sep,elemopt.rep1());
    var or=g("or").ands(seq,br).ret(function (a) {return a;});
    //var ors=g("ors").ands(or.rep1());
    var oneof=tk("one").and(tk("of"));
    var def=g("def").ands(symbol,tk(":"),oneof.opt(),br,or.rep1()).ret("name", null, null, "ors");
    var defs=def.rep0();

    $.parse=function (src) {
        var st=new Parsec2.ParseState(src);
        var res=def.parse(st);
        if (!res.success) {
            var ss=src.substring(0, st.src.maxPos)+"^"+src.substring(st.src.maxPos);
            console.log("Err at "+ss.substring(0,100));
            return "ERROR";
        } else {
            var b=XMLBuffer(src);
            b(res.result[0]);
            return b.buf;
        }
    };
    $.test=function (){
        var st=new Parsec2.ParseState("\n");
        var res=br.parse(st);

        if (!res.success) {
            console.log("Err at "+res.src.maxPos);
        } else {
            console.log("OK");
        }
    }
    return $;
}();

console.log( KRGrammar.parse(sys.fileText("C:/bin/Dropbox/cej1203nishidaLangedu/grammar.txt")+"" ) );
//KRGrammar.test();
