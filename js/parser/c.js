// (Deprecated) Loosely defined grammar. Path Highlight feature is disabled.
sys.load("js/parsec_pure.js");
var ip=Inforno.Parsec.init();
var _abbr={
	expression_statement: "expr_stmt",
	statements: "stmts",
	number: "num",
	declarations: "decls",
	declaration: "decl",
	variable: "var",
	attr_arguments: "attr_args",
	abbreviation: "abbr"
};
// todo: switch   ? :

/*var spr=/^"([^"\\]*(\\.)*)*"/;
console.log("Match?");
//spr.exec('"Hello, world.\\"\n    return(0); { __END__');
spr.exec  ('"Hello, world.____________________________');
console.log("Match!");*/

var e;
var END="__END__";
var ATTR_PREFIX="attr_"; // Same as Path.java
String.prototype.replaceG=function (pat,func) {
	var global=true;//pat.global;//!!(pat+"").match(/\/\w*g\w*$/);
	//console.log("Repl "+this+" -> "+pat+" global="+global);
	var res="";
	var st=this;
	while (true) {
		var r=pat.exec(st);
		//console.log("Match "+st+" to "+pat+" r="+r);
		if (!r) return res+st;
		var pos=st.indexOf(r[0]);
		r.leftContext=st.substring(0,pos);
		r.rightContext=st.substring(pos+r[0].length);
		var repl=(typeof func=="function"?func(r):func);
		res+=r.leftContext+repl;
		if (!global) return res+r.rightContext;
		st=r.rightContext;
		//console.log("res="+res+" st="+st);
	}
};
//console.log(/s/g);
/*console.log("test".replace2(/t/g,"SS"));
var reg=/<(\w+)>/;
console.log(""+ reg.exec(" <name>;") );
console.log(""+ reg.exec(" <name>;") );*/

AP = ip.Parsers.define(function() {
	var t = this;
	function sp(r, f) {
		var str;
		if (typeof r=="string") {
			str=t.str(r);
		} else {
			str=t.reg(r);
		}
		//   (\/\*([^\/]|[^*]\/|\r|\n)*\*\/)*
		return t.reg(/^(\s*(\/\*([^\/]|[^*]\/|\r|\n)*\*\/)*(\/\/.*\n)*)*/).and(str).ret(function(a, b) {

		//return t.reg(/^\s*/).and(str).ret(function(a, b) {
			if (typeof f == "function")
				return f(b);
			if (typeof f == "number")
				return b[f];
			return {pos:b.pos, text:b[0],
				toString: function (){
					return this.text;//+"("+this.pos+")";
				}
			}
		});
	}
	function abbr(n) {
		if (_abbr[n]) return _abbr[n];
		return n;
	}
	function tag(name,cont) {
		name=abbr(name);
		return "<"+name+">"+cont+"</"+name+">";
	}
	function tagf(self, fmt) {
		return tag(self.type, fmt.replaceG(/<(-?)(\w+)>/, function (r) {
			var tagName=r[2]; //r.replace(/^</,"").replace(/>$/,"");
			if (r[1].length>0) return self[tagName];
			return tag(ATTR_PREFIX+tagName, self[tagName]);
		}) );
	}
	function tagff(fmt) {
		return function () {
			return tagf(this,fmt);
		};
	}
	function node(obj,fmt) {
		obj.toString=tagff(fmt);
		return obj;
	}
	function reptNode(name, elements) {
		return {type:name,elements:elements,toString: function () {
			var buf="";
			for (var i in this.elements) {
				buf+=this.elements[i];
			}
			if (buf==="") return "";
			return tag(name,buf);
		}};
	}
	function reptNodeF(name) {
		return function (reps) {
			return reptNode(name,reps);
		};
	}
	function lazy(f) { // f:Unit->Parser
		var res;
		function parser() {
			if (res)  return res;
			res=f();
			return res;
		}
		return ip.Parser.create(function (s) {
			return parser().parse(s);
		});
	}
	function stub(name) {
		t[name] = t.empty.ret(function () {
			return {type:name,toString: function () {return "Stub:"+name;}};
		});
	}
	function failStub(name) {
		t[name] = t.fail;/*.ret(function () {
			return {type:name,toString: function () {return "Stub:"+name;}};
		});*/
	}
	function plural(name,p) {
		if(!p) p=name+"s";
		t[p]=t.rep0(t[name]).ret(reptNodeF(p));
	}
	t.identifier = sp(/^[a-zA-Z_][0-9a-zA-Z_]*/).tap("ident");
	t.type= t.identifier;
	t.initializer = sp("=").and(lazy(function (){return t.expression;})).ret(function (eq,e) {return e;});
	t.dimension_declaration = sp("[").and(lazy(function (){return t.expression;})).and(sp("]")).ret(function (s,n) {
		return n;
	});
	t.declarator = t.identifier.and(t.rep0(t.dimension_declaration)).and(t.opt(t.initializer)).ret(function (n,ac,i) {
		//return node({type:"declarator", name:n, dimensions:ac},"<name>");
		var init=(i.isEmpty?"":"=<initializer>");
		var dim=(ac.isEmpty?"":"<dimensions>");
		return node({type:"declarator", name:n,initializer:i, dimensions:ac },"<name>"+dim+init);
	});
	t.declarator_list = t.sep1(t.declarator,sp(","),true).ret(function (r) {
		return r;
	});
	t.declaration = t.type.and(t.declarator_list).and(sp(";")).tap("vardecl").ret(function (t,d) {
		return node({type:"declaration", vtype:t, declarators:d},"<vtype> <declarators>;");
	});
	t.parameter_declaration =
		sp("void").ret(function () {
			return node({type:"parameter_declaration",ptype:"void"},"void");
		}).or(
		t.type.and(t.identifier).ret(function (t,n) {
			return node({type:"parameter_declaration", ptype:t, name:n},"<ptype> <name>");
		}));
	t.parameter_declarations =
		t.sep(t.parameter_declaration, sp(","), true).
		ret(function (plist) {
			//console.log("Succ"+t.state.pos);
			//console.log(plist);
			if (typeof plist=="string") plist=[];
			return {type:"parameter_declarations",plist:plist, toString: function () {
				return this.plist.join(",");
			}};
		});
	t.compound_statement= lazy(function () {
		return sp("{").and(t.declarations).and(t.statements).and(sp("}")).ret(function (p1,d,s,p2) {
			return node({type:"compound_statement",declarations:d,statements:s},"{'{'} <-declarations> <-statements> {'}'}");
		});
	});
	t.function_declaration_head=
		t.type.and(t.identifier).ret(function (t,n) {
			return {type:t, name:n};
		}).or(t.identifier.ret(function (n) {
			return {type:"int", name:n};
		}));
	t.function_definition =
		t.function_declaration_head.
		and(sp("(")).
		and(t.parameter_declarations).
		and(sp(")")).
		and(t.compound_statement).
		ret(function (h,lp,params,rp,body) {
			var t=h.type, n=h.name;
			//console.log(params);
			return node({type:"function_definition",return_type: t,name:n, params:params, body:body}, "<return_type> <name>(<params>) {<body>}");
		});
	t.function_declaration =
		t.function_declaration_head.
		and(sp("(")).
		and(t.parameter_declarations).
		and(sp(")")).
		and(sp(";")).
		ret(function (h,lp,params,rp,sc) {
			var t=h.type, n=h.name;
			console.log(params);
			return node({type:"function_declaration",return_type: t,name:n, params:params}, "<return_type> <name>(<params>);");
		});

	plural("declaration");
	t.expression=lazy(function () {return t.let.tap("expr");});
	t.argument_list = sp("(").tap("arglist").and(t.sep(t.expression,sp(","),true)).and(sp(")")).ret(function (k,a) {
		return a;
	});
	t.array_access = sp("[").and(t.expression).and(sp("]")).ret(function (k,e) {
		return node({type:"array_access",expression:e},"[<-expression>]");
	});
	t.call=t.identifier.and(t.opt(t.argument_list)).and(t.rep0(t.array_access)).ret(function (name,args,ac) {
		var argt=(args.isEmpty ? "": "(<arguments>)");
		var act= (ac.length==0 ? "": "<array_accesses>");
		var type=(args.isEmpty ? "variable":"call");
		//console.log("args len="+args.length);
		return node( {type:type,name:name,arguments:args,array_accesses:ac},"<name>"+argt+act);
	});
	t.decimal=sp(/^[0-9]+(\.[0-9]+)?/).ret(function(r) {
		return node({type: "number", value:r.text}, "<-value>");// toString: function () {return this.value;}};
	});
	t.hexadecimal=sp(/^0x[0-9a-fA-F]+/).ret(function(r) {
		return node({type: "hexnumber", value:r.text}, "<-value>");// toString: function () {return this.value;}};
	});

	t.num = t.hexadecimal.or(t.decimal);
	var literalP={exec: function (s) {
		var alternates=/^"([^"\\]*(\\.)*)*"/;
		if (s.substring(0,1)!=='"') return false;
		for (var i=1 ;i<s.length ; i++) {
			var c=s.substring(i,i+1);
			if (c==='"') {
				return [s.substring(0,i+1)];
			} else if (c==="\\") {
				i++;
			}
		}
		return false;
	}};
	t.literal=sp(literalP).ret(function (s) {
		return node({type:"literal",string:s.text/*.replace(/\\/g,"\\\\")*/},"<-string>");
	});
	t.char_literal=sp(/^'([^'\\]|\\.)'/).ret(function (s) {
		return node({type:"char_literal",string:s.text/*.replace(/\\/g,"\\\\")*/},"<-string>");
	});
	t.constant=t.num.or(t.literal).or(t.char_literal);
	t.element=t.call.
	or(t.constant).
	or(sp("(").and(t.expression).and(sp(")")).ret(function (k,e){
		return node({type:"paren",expression:e},"(<expression>)");
	}));
	t.statement = t.compound_statement.or(
		sp("break").and(sp(";")).ret(function () {
		return node({type:"break"},"break;");
	})).or(
		sp("continue").and(sp(";")).ret(function () {
		return node({type:"contine"},"contine;");
	})).or(
		sp("return").and(t.opt(t.expression)).and(sp(";")).ret(function (r,v,s) {
		if (v.length==0) return node({type:"return"},"return;");
		return node({type:"return",value:v},"return <value>;");
	})).or(
		lazy(function () {return t.if_statement;}))
	.or(lazy(function () {return t.switch_statement;}))
	.or(lazy(function () {return t.case_statement;}))
	.or(lazy(function () {return t.default_statement;}))
	.or(lazy(function () {return t.do_while_statement;}))
	.or(lazy(function () {return t.while_statement;}))
	.or(lazy(function () {return t.for_statement;}))
	.or(t.expression.and(sp(";")).tap("exprstmt").ret(function (e,s) {
		return node({type:"expression_statement",expression:e},"<-expression>;");
	})).or(sp(";").tap("empst").ret(function () {
		return node({type:"empty_statement"},";");
	})).tap("stmt")
	;
	t.for_statement = sp("for").and(sp("(")).
			and(t.opt(t.expression)).and(sp(";")).
			and(t.opt(t.expression)).and(sp(";")).
			and(t.opt(t.expression)).and(sp(")")).
			and(t.statement).ret(function (w,k,init,s1,c,s2,inc,k2,s) {
		return node({type:"for",initializer:init,condition:c,increment:inc,loop:s},"for (<initializer>;<condition>;<increment>) <loop>");
	});
	t.while_statement = sp("while").and(sp("(")).and(t.expression).and(sp(")")).and(t.statement).ret(function (w,k,c,k2,s) {
		return node({type:"while",condition:c,loop:s},"while (<condition>) <loop>");
	});
	t.switch_statement = sp("switch").and(sp("(")).and(t.expression).and(sp(")")).and(t.statement).ret(function (w,k,c,k2,s) {
		return node({type:"switch",test:c,body:s},"switch (<test>) <body>");
	});
	t.case_statement = sp("case").and(t.expression).and(sp(":")).ret(function (c,e) {
		return node({type:"case",value:e},"case <value>:");
	});
	t.default_statement = sp("default").and(sp(":")).ret(function (c,e) {
		return node({type:"default"},"default:");
	});
	t.do_while_statement = sp("do").and(t.statement).
	    and(sp("while")).and(sp("(")).and(t.expression).and(sp(")")).and(sp(";")).ret(function (d,s,w,k,c,k2,se) {
		return node({type:"do_while",condition:c,loop:s},"do <loop> while (<condition>);");
	});
	t.if_prefix = sp("if").and(sp("(")).and(t.expression).and(sp(")")).ret(function (i,k,c){return c;});
	t.else_part = t.opt(sp("else").and(t.statement).ret(function (e,s){return s;}));
	t.if_statement= t.if_prefix.and(t.statement).and(t.else_part).tap("if_stmt").ret(function (ip,th,el) {
		if (el.length==0) return node({type:"if",condition:ip,then:th},"if (<condition>) <then>");
		return node({type:"if",condition:ip,then:th,"else":el},"if (<condition>) <then> else <else>");
	});

	plural("statement");
	t.definition = t.function_definition.or(t.function_declaration).or(t.declaration);
	//t.definitions = t.rep(t.definition).ret(reptNodeF("definitions"));
	plural("definition");
	t.program = t.definitions.and(sp(END)).ret(function (r) {return r;});


	function esc(s) {
		return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
	}
	function binop(name, elem, op) {
		t[name] = t.sep1(elem, op, false).tap("opr_"+name).ret(function(r) {
			//console.log("opr_"+name+" succ r="+disp(r));
			if (!r.tails) console.log(disp(r));
			if (r.tails.length==0) return r.head;
			var res={};
			res.name=name;
			res.type="binop";
			res.head=r.head;
			res.tails=r.tails;
			res.toString=function () {
				var buf="";
				for (var i in this.tails) {
					var t=this.tails[i];
					buf+= tag("op",esc(t.sep.text));
					//console.log(t.sep.text);
					buf+=t.value;
				}
				return "<"+this.name+">"+this.head+buf+"</"+this.name+">";
			};
			return res;
		});
	}
	t.postfix_increment=t.element.and(t.opt(sp(/^(\+\+|--)/))).ret( function (v,o) {
		if (o.isEmpty) return v;
		return node({type:"increment",op:o,value:v},"<value><op>");
	});
	t.unary = t.opt(sp(/^(\+\+|--|\+|-|\*|&|!)/)).and(t.postfix_increment).ret(function (h,t) {
		if (h.isEmpty) return t;
		if (h.text.length==2) return node({type:"increment",op:h,value:t},"<op><value>");
		return node({type:"unary",op:esc(h.text),value:t},"<op><value>");
	});
	t.cast = t.opt(sp("(").and(t.type).and(sp(")")).ret(function (a,b,c){
		return b;
	})).and(t.unary).ret(function (h,t) {
		if (h.isEmpty) return t;
		return node({type:"cast",to:h,expression:t},"(<to>)<expression>");
	});
	binop("mul", t.cast, sp(/^[\*\/%]/));
	binop("add", t.mul, sp(/^[+\-]/));
	binop("comp", t.add, sp(/^(<=|>=|!=|==|<|>)/));
	binop("log_and", t.comp, sp(/^&&/));
	binop("log_or", t.log_and, sp(/^\|\|/));
	t.three_tail = sp("?").and(t.expression).and(sp(":")).and(t.expression).ret(function (q,t,s,e) {
		return {then:t,"else":e};
	});
	t.three_op=t.log_or.and(t.opt(t.three_tail)).ret(function (o,t) {
		if (t.isEmpty) return o;
		return node({type:"three_op",cond:o, then: t.then, "else": t["else"]},"<cond>?<then>:<else>");
	});
	//binop("let", t.three_op, sp(/^[\+\-\*\/]?=/));
	t.let = t.sep1(t.three_op, sp(/^[\+\-\*\/]?=/) , false).tap("opr_let").ret(function(r) {
		if (r.tails.length==0) return r.head;
		var res={};
		var i=-1;
		while (true) {
			res.name="let";
			res.toString=function () {
				return tag(this.name, tag("attr_left",this.head)+tag("attr_right", this.tail.value));
			};
			if (i<0) {
				res.head=r.head;
			} else {
				res.head=r.tails[i];
			}
			if (i==r.tails.length-2) {
				res.tail=r.tails[i+1];
				break;
			} else {
				res=res.tail={};
				i++;
			}
		}
		return res;
	});

	//binop("test", sp("a") , sp("+"));
	t.test=t.str("a").and(t.rep0(t.str("+"))).ret(function (a,b) {
		console.log("a="+a);
		console.log("b="+b);
		return a+b;
	});

});
/*var a2=new AP("test @");
		a2.idt.parse();*/
/*  BP= ip.Parsers.define(function() {
        var t=this;
        t.test=t.chr("a").and(t.chr("b")).ret(function (a,b) {
            return [a,b];
        });
    });
    var b= new BP("ab");
    var res=b.test.parse();
    console.log("RES=" + disp(res.result));

 */
//var a = new AP("5  =  4 +2");// 123 * 456 / 5 -789 + 2");
//var a = new AP("for(;;) {a;} }");// 123 * 456 / 5 -789 + 2");
//var a = new AP("a+a");// 123 * 456 / 5 -789 + 2");
//var a = new AP("a+a");// 123 * 456 / 5 -789 + 2");
function pos2rc(src,pos) {
	var res={row:1,col:1};
	var a=src.split(/\n/);
	//console.log("SRC = "+src+" a.len="+a.length);
	for (var i=0 ; i<a.length ; i++) {
		var len=a[i].length+1;
		if (pos<len) {
			res.col=pos;
			return res;
		}
		pos-=len;
		res.row++;
	}
	return res;
}
function parse(src) {
	function preprocess(s) {
        var buf="";
        s.split(/\n/).forEach(function (l) {
            if (l.match(/^\s*#(.*)/)) {
                buf+=("//"+RegExp.$1+"\n");
            } else {
            	buf+=(l+"\n");
            }
        });
        return buf;
	}
	src=preprocess(src);
	var a = new AP(src+" "+END);// 123 * 456 / 5 -789 + 2");

//	var a = new AP('int x=3;int main(void) {int x; int n; scanf("%d",&n); for(x=0;x<5;x++) { printf("%d\\n",x*n); } }');// 123 * 456 / 5 -789 + 2");
	var state=new ip.ParseState();
	var res = a.program.parse(state);
	console.log("RESTYPE="+res.type);
	if (res.type==="fail") {
		var rc=pos2rc(src,state.maxPos.pos);
		return "Syntax error at "+rc.row+":"+rc.col;
	}
	//console.log("RESPOS="+state.maxPos.pos);
	/*for (var i in state) {
	console.log("state."+i+"="+state[i]);
}*/
	//console.log("RES=" + disp(res.result));
	var evalStr="var RES=" + res.result[0]+";";
	//console.log("Eval "+evalStr);
	eval(evalStr);//disp(res.result));
	//console.log(RES);
	return RES;
}
function disp(a) {
	if (typeof a == "string")
		return a;
	var buf="";
	buf += "{";
	var c = "";
	for (var i in a) {
		buf += c + i+":"+ disp(a[i]);
		c = ",";
	}
	buf += "}";
	return buf;
}
/*return*/ var r={parse:parse, a:3,  xmlPositionSensitve:false}; r;