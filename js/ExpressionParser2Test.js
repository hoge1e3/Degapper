console.log("start");

sys.load("js/parsec2.js");
sys.load("js/ExpressionParser2.js");
sys.load("js/IndentBuffer.js");
sys.load("js/Visitor.js");

function tk(s) {
    return Parsec2.StringParser.str(s).ret(function (r) {
        console.log("RDE- "+r.pos);
        return {type: "token", text:r.src.str.substring(r.pos, r.pos+r.len) };
    }).setName(s).first(Parsec2.StringParser.empty, s.substring(0,1));
}

var ep=ExpressionParser();
ep.postfix(4,tk("()"));
ep.postfix(4,tk("--"));
ep.postfix(4,tk("++"));
ep.prefix(3,tk("-"));
ep.element(tk("A"));
ep.infixr(0,tk("="));
ep.infixl(1,tk("+"));
ep.infixl(1,tk("-"));
ep.infixl(2,tk("*"));
console.log("ep");

var e=ep.build();
console.log("built "+e);


var st=new Parsec2.ParseState("A=A=A+-A*A--+A");
var res=e.parse(st);
console.log(res.isSuccess());
console.log(res.result[0]);
console.log(res.pos);

var buf=IndentBuffer();
var v=buf.visitor=Visitor({
    infix: function (node) {
        buf.printf("(%v%s%v)", node.left, node.op.text , node.right);
    },
    infixl: function (node) {
        buf.printf("(%v%s%v)", node.left, node.op.text , node.right);
    },
    infixr: function (node) {
        buf.printf("(%v%s%v)", node.left, node.op.text , node.right);
    },
    postfix: function (node) {
        buf.printf("(%v%s)", node.left, node.op.text);

    },
    prefix: function (node) {
        buf.printf("(%s%v)", node.op, node.right);
    },
    token: function (node) {
        buf.print(node.text);
    }
});
/*v.def=function (node) {
    buf.printf("%s", node);
};*/
v.visit(res.result[0]);
console.log(buf.buf);




