sys.load("js/parser.js");
//sys.load("js/parsec2.js");
sys.load("js/ExpressionParser.js");
sys.load("js/Grammar.js");
sys.load("js/XMLBuffer.js");
sys.load("js/IndentBuffer.js");
sys.load("js/disp.js");

Java=function () {
    var p;
    try {p=Parsec2;} catch(e) {p=Parser;}
	var $={};
	$.parse = function (str) {
		var g=Grammar();
		var G=g.get;

		var sp=p.StringParser;//(str);
		//                 \s |  "/*" ([^/] [^*]/  \r \n)* "*/" |  // ^\n* \r?\n
		var space=sp.reg(/^(\s*(\/\*([^\/]|[^*]\/|\r|\n)*\*\/)*(\/\/[^\n]*\r?\n)*)*/);
		function tk(r, f) {
			var pat;
			if (typeof r=="string") {
				pat=sp.str(r);
			} else {
				if ((r+"").match(/^\//)  && ! (r+"").match(/^\/\^/) ) throw r+" does not have ^";
				pat=sp.reg(r);
			}
			return space.and(pat).ret(function(a, b) {
				if (typeof f == "function")
					return f(b);
				if (typeof f == "number")
					return b[f];
				var res={};
				res.pos=b.pos;
				res.len=b.len;
				res.text=str.substring(b.pos, b.pos+b.len);
				//console.log("b.text="+b.text);
				//res.type="token";
				res.toString=function (){
					return this.text;//+"("+this.pos+")";
				};
				return res;
			}).setName("tk("+r+")").tap("tk");
		}
		var reserved={"public":true, "static":true , "private":true, "protected":true, "class":true, "return":true, "if":true,
			     "for":true,
			     "while":true,
			     "break":true,
			     "do":true,
			     "switch":true,
			     "try": true,
			     "catch": true,
			     "finally": true,
			     "instanceof":true,
			     "throws":true,
			     "throw":true,
			     "new": true
  	    };
		var hex=tk(/^0x[0-9a-fA-F]+/).ret(function (n) {
            n.type="hexnumber";
            n.value=parseInt(n.text);
            return n;
        });
		var num=tk(/^[0-9]+(\.[0-9]+)?[a-z]*/).ret(function (n) {
			n.type="number";
			n.value=parseInt(n.text.replace(/[a-z]*$/,""));
			//console.log("n.val="+n.value);
			return n;
		});
	    var symbol=tk(/^[a-zA-Z_$\u0100-\uffff][a-zA-Z0-9_$\u0100-\uffff]*/).except(function (s) {
			return reserved.hasOwnProperty(s.text);
		}).ret(function (s) {
			s.type="symbol";return s;
		}).setName("symbol");

		var minus=tk("-");
		var plus=tk("+");
		var mul=tk("*");
		var div=tk("/");
		var mod=tk("%");
		var eq=tk("==");
		var ne=tk("!=");
		var ge=tk(">=");
		var le=tk("<=");
		var gt=tk(">");
		var lt=tk("<");
        var and=tk({exec: function (s) {
            if (s.substring(0,1)=="&" && s.substring(1,2)!="&") return ["&"];
            return false;
        }}).ret(function (s) {
            s.type="bitand";
            return s;
        });
        var or=tk({exec: function (s) {
            if (s.substring(0,1)=="|" && s.substring(1,2)!="|") return ["|"];
            return false;
        }}).ret(function (s) {
            s.type="bitor";
            return s;
        });
		var andand=tk("&&");
		var oror=tk("||");

		var minus=tk("-");//.first(space,"-");
		var plus=tk("+");//.first(space,"+");
		var mul=tk("*");
		var div=tk("/");
		var mod=tk("%");
		var assign=tk("=");
		var literal=tk({exec: function (s) {
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
		}}).ret(function (s) {
			s.type="literal";
			//console.log("S="+typeof s);
			return s;
		});


		var e=ExpressionParser() ;
		var arrayElem=g("arrayElem").ands(tk("["), e.lazy() , tk("]")).ret(null,"subscript");
		var call=g("call").ands(tk("("), e.lazy().sep0(tk(","),true) , tk(")")).ret(null,"-args");
		var member=g("member").ands(tk(".") , symbol ).ret(null,     "name" );
		var dim=g("dim").ands(tk("["), e.lazy().opt() , tk("]")).ret(null,"value");
		var dims=g("dims").ands(dim.rep1()).ret("-dims");
		var newExpr=g("new").ands(tk("new"), "typeHead", call.or(dims) ).ret(null, "otype", "-callOrDim");
		var cast=g("cast").ands(tk("("), "type", tk(")")).ret(null, "-to");
		var parenExpr = g("parenExpr").ands(tk("("), e.lazy() , tk(")")).ret(null,"expr");

        e.element(hex);
		e.element(num);
		e.element(symbol);
		e.element(literal);
		e.element(newExpr);
		e.element(parenExpr);
		var prio=0;
		e.infixr(prio,assign);
		e.infixr(prio,tk("+="));
		e.infixr(prio,tk("-="));
		e.infixr(prio,tk("*="));
		e.infixr(prio,tk("/="));
		e.infixr(prio,tk("%="));
		e.infixr(prio,tk("|="));
		e.infixr(prio,tk("&="));
		prio++;
		e.infixl(prio,oror);
		prio++;
		e.infixl(prio,andand);
        prio++;
        e.infixl(prio,or);
        prio++;
        e.infixl(prio,and);
		prio++;
		e.infix(prio,tk("instanceof"));
		e.infix(prio,eq);
		e.infix(prio,ne);
		e.infix(prio,ge);
		e.infix(prio,le);
		e.infix(prio,gt);
		e.infix(prio,lt);
		prio++;
		e.infixl(prio,minus);
		e.infixl(prio,plus);
		prio++;
		e.infixl(prio,mul);
		e.infixl(prio,div);
		e.infixl(prio,mod);
		prio++;
		e.prefix(prio,tk("++"));
		e.prefix(prio,tk("--"));
		e.prefix(prio,tk("+"));
		e.prefix(prio,tk("-"));
		e.prefix(prio,tk("!"));
		e.prefix(prio,cast);
		prio++;
		e.postfix(prio,tk("++"));
		e.postfix(prio,tk("--"));

		prio++;
		e.postfix(prio,call);
		e.postfix(prio,member);
		e.postfix(prio,arrayElem);


		function mki(left, op ,right) {
			var res={type:"infix",left:left,op:op,right:right};
			p.setRange(res);
			res.toString=function () {
				return "("+left+op+right+")";
			};
			return res;
		}
		e.mkInfixl(mki);
		e.mkInfixr(mki);
		/*e.mkPostfix(function (p) {
			return {type:"postfix", expr:p};
		});*/
		var expr=e.build();

		var stmt=g("stmt").ors("return", "if", "for", "while", "dowhile", "break", "try", "compound", "varDecl", "exprstmt");

		var elseP=tk("else").and(stmt).retN(1);
		var returns=g("return").ands(tk("return"),expr.opt(),tk(";") ).ret(null,"value");
		var elif=g("elif").ands(tk("else"), tk("if"), tk("("), expr, tk(")"), stmt).ret(null,null,null, "-cond",null,"-then");
		var ifs=g("if").ands(tk("if"), tk("("), expr, tk(")"), stmt, elif.rep0(),  elseP.opt() ).ret(null, null,"-cond",null,"-then","-elifs","-else");
		var forInitType=g("forInitType").ands( G("type") , expr ). ret("-vtype", "-expr");
		var forInit=g("forInit").ors( "forInitType" , expr );
		var fors=g("for").ands(tk("for"),tk("("),
				   forInit.opt() , tk(";"),
				   expr.opt()    , tk(";"),
				   expr.opt()    , tk(")"),
		     "stmt" ).ret(null,null,"-init", null, "-cond",null, "-next" ,null,  "-loop");
        var dowhiles=g("dowhile").ands(tk("do"),"stmt",tk("while"), tk("("), expr, tk(")"), tk(";") ).ret(null,"-loop",null,null,"-cond");
		var whiles=g("while").ands(tk("while"), tk("("), expr, tk(")"), "stmt").ret(null,null,"-cond",null,"-loop");
		var breaks=g("break").ands(tk("break"), tk(";")).ret("-brk");
		var fins=g("finally").ands(tk("finally"), "stmt" ).ret(null, "-stmt");
		var catchs=g("catch").ands(tk("catch"), tk("("), G("type"), symbol, tk(")"), "stmt" ).ret(null,null,"-vtype", "-name",null, "-stmt");
		var catches=g("catches").ors("catch","finally");
		var trys=g("try").ands(tk("try"),"stmt",catches.rep1() ).ret(null, "-stmt","-catches");


		g("exprstmt").ands(expr,tk(";")).ret("-expr");
		g("compound").ands(tk("{"), stmt.rep0(),tk("}")).ret(null,"-stmt") ;
		var typeParams=g("typeParams").ands(tk("<"), G("typeHead").sep1(tk(","),true), tk(">") ).ret(null, "-types");
		var typeHead=g("typeHead").ands(symbol.sep1(tk("."),true), typeParams.opt()).ret("-names", "-typeParams");
		var arrayDecl=g("arrayDecl").ands(tk("["),tk("]")).ret("-l","-r");
		var type=g("type").ands(typeHead, arrayDecl.rep0() ).ret("-head","-array");
		var varDeclElem=g("varDeclElem").ands(symbol, arrayDecl.rep0(),  tk("=").and(expr).retN(1).opt() ).ret("name","arrays", "init");
		var varDecl=g("varDecl").ands("type", varDeclElem.sep1(tk(","),true), tk(";")).ret("vtype", "names");
		var annotation=g("annotation").ands(tk(/^((public)|(private)|(protected)|(package)|(static)|(final))/)).ret("-value");
		var paramDecl= g("paramDecl").ands("type", symbol ).ret("ptype","name");
		var paramDecls=g("paramDecls").ands(tk("("), paramDecl.sep0(tk(","),true), tk(")")  ).ret(null, "-params");
		var _throws=g("throws").ands(tk("throws"), type.sep1(tk(","),true)).ret(null,"exceptions");
		g("methodDeclHead").ands(annotation.rep0(), "type", symbol ,"paramDecls",_throws.opt()).ret("-annotations","returnType","name","-params","-throws");
		var methodDecl=g("methodDecl").ands("methodDeclHead","compound").ret("-head","-body");
		var constructorDecl=g("constructorDecl").ands(annotation.rep0(), symbol, "paramDecls", _throws.opt() ,"compound").ret("-annotations","name","-params","-throws","-body");
		var decl=g("decl").ors("methodDecl","constructorDecl","varDecl");
		var pkg=g("package").ands(tk("package"), typeHead, tk(";")).ret(null, "-names");

		var _extends=g("extends").ands(tk("extends"), "typeHead").ret(null, "superclass");
		var classDecl=g("classDecl").ands(annotation.rep0(),tk("class"),symbol, _extends.opt(), tk("{"), decl.rep0(), tk("}") ).ret(
			"-annotations", null, "name", "-extends", null, "-body"
		);
		var symbolOrAsterisk=symbol.or(tk("*"));
		var _import = g("import").ands(tk("import"), symbolOrAsterisk.sep1(tk("."),true) , tk(";") ).ret(null,"pkgs");

		var program=g("program").ands(pkg.opt(), _import.rep0(), classDecl.rep0() , space, sp.eof ).ret("package","-imports","-decls");
		var res=sp.parse(program, str);
		console.log("POS="+res.src.maxPos);
		console.log(disp(res.result[0]));
		if (res.isSuccess() ) {
			var node=res.result[0];
			var xmlsrc=$.genXML(str, node);
			return "<java>"+xmlsrc+"</java>";
			//return eval("var r="+xmlsrc+"; r"); //"RES="+disp(res.result[0]);
		}
		return "ERROR\nSyntax error at "+res.src.maxPos+"\n"+res.src.str.substring(0,res.src.maxPos)+"!!HERE!!"+res.src.str.substring(res.src.maxPos);
	};
	$.genXML= function (src, node) {
		var x=XMLBuffer(src) ;
		x(node);
        return x.buf;
	};
	return $;
}();
