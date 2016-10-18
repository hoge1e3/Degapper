// Loosely defined grammar. Path Highlight feature is enabled.
sys.load("js/parsec2.js");
sys.load("js/ExpressionParser.js");
sys.load("js/Grammar.js");
sys.load("js/XMLBuffer.js");
sys.load("js/IndentBuffer.js");
sys.load("js/disp.js");
sys.load("js/Visitor.js");

C=function () {
	var p=Parsec2;
	var $={};
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
	$.parse = function (str) {
		var g=Grammar();
		var G=g.get;
		//console.log("prepreproc - "+str);
		str=preprocess(str);
		var sp=p.StringParser;//(str);
		var space=sp.reg(/^(\s*(\/\*([^\/]|[^*]\/|\r|\n)*\*\/)*(\/\/.*\n)*)*/);
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
			}).setName("tk("+r+")");
		}
		var reserved={"public":true, "static":true , "private":true, "protected":true, "class":true, "return":true, "if":true,
			     "for":true,
			     "while":true,
			     "break":true,
			     "do":true,
			     "switch":true,
			     "struct":true,
			     "typedef":true,
			     "extern":true
			     //"try": true,
			     //"catch": true,
			     //"finally": true,
			     //"instanceof":true,
			     //"throws":true,
			     //"throw":true,
			     //"new": true
  	    };
		var num=tk(/^[0-9]+(\.[0-9]+)?/).ret(function (n) {
			n.type="number";
			n.value=parseInt(n.text);
			//console.log("n.val="+n.value);
			return n;
		});
		var symbol=tk(/^[a-zA-Z_$][a-zA-Z0-9_$]*/).except(function (s) {
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
			//console.log("literal="+s.text);
			return s;
		});
		var cliteral=tk({exec: function (s) {
			if (s.substring(0,1)!=="'") return false;
			for (var i=1 ;i<s.length ; i++) {
				var c=s.substring(i,i+1);
				if (c==="'") {
					return [s.substring(0,i+1)];
				} else if (c==="\\") {
					i++;
				}
			}
			return false;
		}}).ret(function (s) {
			s.type="cliteral";
			return s;
		});

		var e=ExpressionParser() ;
		var arrayElem=g("arrayElem").ands(tk("["), e.lazy() , tk("]")).ret(null,"subscript");
		var argList=g("argList").ands(tk("("), e.lazy().sep0(tk(","),true) , tk(")")).ret(null,"-args");
		var member=g("member").ands(tk(".") , symbol ).ret(null,     "name" );
		var dim=g("dim").ands(tk("["), e.lazy().opt() , tk("]")).ret(null,"value");
		var dims=g("dims").ands(dim.rep1()).ret("-dims");
		//var newExpr=g("new").ands(tk("new"), "typeHead", call.or(dims) ).ret(null, "otype", "-callOrDim");
		var cast=g("cast").ands(tk("("), "type", tk(")")).ret(null, "-to");
		var parenExpr = g("parenExpr").ands(tk("("), e.lazy() , tk(")")).ret(null,"-expr");

		e.element(num);
		e.element(symbol);
		e.element(cliteral);
		e.element(literal);
		//e.element(newExpr);
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
		e.infixr(prio,oror);
		prio++;
		e.infixr(prio,andand);
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
		e.prefix(prio,tk("*"));
		e.prefix(prio,tk("&"));
		e.prefix(prio,cast);
		prio++;
		e.postfix(prio,tk("++"));
		e.postfix(prio,tk("--"));

		prio++;
		e.postfix(prio,argList);
		e.postfix(prio,member);
		e.postfix(prio,arrayElem);

		var ARI="arithmetic",ASN="assign", ARIASN="arithassign", OAND="and", OOR="or",OCOMP="comparison";
		//var PCALL="call", PPLUS2="post_plusplus", PMINUS2="post_minusminus" ;
		var opType={"+":ARI, "-":ARI, "*":ARI, "/":ARI, "%":ARI, "=":ASN,
				"+=":ARIASN, "-=":ARIASN,"*=":ARIASN, "/=":ARIASN, "%=":ARIASN,
				"&&": OAND, "||":OOR,
				">":OCOMP, "<":OCOMP, ">=":OCOMP,"<=":OCOMP, "==":OCOMP,"!=":OCOMP };
		function mki(left, op ,right) {
			var opt="infix";
			if (op) opt=opType[op.text];
			if (!opt) opt="infix";
			var res={type:opt,left:left,op:op,right:right};
			Parsec2.setRange(res);
			res.toString=function () {
				return "("+left+op+right+")";
			};
			return res;
		}
		e.mkInfixl(mki);
		e.mkInfixr(mki);
		e.mkInfix(mki);
		e.mkPostfix(function (expr, op) {
			var res;
			if (op.type=="argList") {
				res={type:"call", "name":expr,"-args":op};
			} else {
				res={type:"postfix", expr:expr, op:op};
			}
			Parsec2.setRange(res);
			return res;
		});
		var expr=e.build();

		var stmt=g("stmt").ors("return", "if", "for", "while", "break",
				/*"try",*/ "compound", "varDecl", "exprstmt","switch", "case","default","do","empty");

		var empty=g("empty").ands(tk(";")).ret();
		var elseP=tk("else").and(stmt).retN(1);
		var returns=g("return").ands(tk("return"),expr.opt(),tk(";") ).ret(null,"-value");
		var ifs=g("if").ands(tk("if"), tk("("), expr, tk(")"), stmt, elseP.opt() ).ret(null, null,"-cond",null,"then","else");
		var forInitType=g("forInitType").ands( G("type") , expr ). ret("-vtype", "-expr");
		var forInit=g("forInit").ors( "forInitType" , expr );
		var fors=g("for").ands(tk("for"),tk("("),
				   forInit.opt() , tk(";"),
				   expr.opt()    , tk(";"),
				   expr.opt()    , tk(")"),
		     "stmt" ).ret(null,null,"-init", null, "-cond",null, "-next" ,null,  "-loop");
		var whiles=g("while").ands(tk("while"), tk("("), expr, tk(")"), "stmt").ret(null,null,"-cond",null,"-loop");
		var breaks=g("break").ands(tk("break"), tk(";")).ret("-brk");
		var switchs=g("switch").ands(tk("switch"), tk("("), expr, tk(")"), "stmt" ).ret(null,null, "-value" ,null, "-stmt");
		var cases=g("case").ands(tk("case"), expr, tk(":")).ret(null,"-value");
		var defaults=g("default").ands(tk("default"), tk(":")).ret();
		var dos=g("do").ands(tk("do"),"stmt",tk("while"),tk("("), expr, tk(")"), tk(";"))
					.ret(null,"-loop",null,null,"-cond");
		//var fins=g("finally").ands(tk("finally"), "stmt" ).ret(null, "-stmt");
		//var catchs=g("catch").ands(tk("catch"), tk("("), G("type"), symbol, tk(")"), "stmt" ).ret(null,null,"-vtype", "-name",null, "-stmt");
		//var catches=g("catches").ors("catch","finally");
		//var trys=g("try").ands(tk("try"),"stmt",catches.rep1() ).ret(null, "-stmt","-catches");


		g("exprstmt").ands(expr,tk(";")).ret("-expr");
		g("compound").ands(tk("{"), stmt.rep0(),tk("}")).ret(null,"-stmt") ;
		var typeParams=g("typeParams").ands(tk("<"), G("typeHead").sep1(tk(","),true), tk(">") ).ret(null, "-types");
		var typeHead=g("typeHead").ands(tk("struct").opt(), symbol).ret(null, "name");
		var arrayDecl=g("arrayDecl").ands(tk("["),expr.opt(), tk("]")).ret("-l","elems","-r");
		var pointerDecl=g("pointerDecl").ands(tk("*")).ret("-asterisk");
		var parray=g("parray").ors(arrayDecl, pointerDecl);
		var stype=g("stype").ands(typeHead, parray.rep0() ).ret("-head","-parray");
		var struct=g("struct").ands(tk("struct"),symbol.opt(), tk("{"),G("varDecl").rep0(), tk("}")).ret(null,"name", null,"members");
		var type=g("type").ors(stype,struct);
		var varDeclElem=g("varDeclElem").ands(symbol, arrayDecl.rep0(),  tk("=").and(expr).retN(1).opt() ).ret("name","arrays", "init");
		var varDecl=g("varDecl").ands("type", varDeclElem.sep1(tk(","),true), tk(";")).ret("vtype", "names");
		var annotation=g("annotation").ands(tk(/^((static)|(auto))/)).ret("-value");
		var paramDecl= g("paramDecl").ands("type", symbol, arrayDecl.rep0() ).ret("ptype","name", "-array");
		var voidParam= g("voidParam").ands(tk("void")).ret("-void");
		var hasParams=g("hasParams").ands(paramDecl.sep0(tk(","),true)).ret("-params");
		var paramDeclIn=g("paramDeclIn").ors("voidParam","hasParams");
		var paramDecls=g("paramDecls").ands(
				tk("("), "paramDeclIn"  , tk(")")
			).ret(null, "-params");
		var retName=type.and(symbol).ret(function(a,b){return {ret:a,name:b};}).or(symbol);
		g("functionDeclHead").ands(annotation.rep0(), retName ,"paramDecls").ret(
				"-annotations","retName","-params",
				function (node) {
					if (node.retName.ret) {
						node.returnType=node.retName.ret;
						node.name=node.retName.name;
					} else {
						node.name=node.retName;
					}
					delete node.retName;
					return node;
				});
		var functionDecl=g("functionDecl").ands("functionDeclHead","compound").ret("-head","-body");
		var prototypeDecl=g("prototypeDecl").ands("functionDeclHead",tk(";")).ret("-head");
		var typedef=g("typedef").ands(tk("typedef"), type, symbol,tk(";")).ret("-orig","-to");
		var decl=g("decl").ors("prototypeDecl","functionDecl","varDecl","typedef");
		/*var pkg=g("package").ands(tk("package"), typeHead, tk(";")).ret(null, "-names");

		var _extends=g("extends").ands(tk("extends"), "typeHead").ret(null, "superclass");
		var classDecl=g("classDecl").ands(annotation.rep0(),tk("class"),symbol, _extends.opt(), tk("{"), decl.rep0(), tk("}") ).ret(
			"-annotations", null, "name", "-extends", null, "-body"
		);*/
		//var _import = g("import").ands(tk("import"), type , tk(";") ).ret(null,"pkgs");

		var program=g("program").ands(decl.rep0() , space, sp.eof ).ret("-decls");
		var res=sp.parse(program, str);
		console.log("POS="+res.src.maxPos);
		console.log(disp(res.result[0]));
		var v,vf={};
		function flatten(opType) {
			vf[opType]=function (node) {
				if (!node.op) return node;
				var e=[],E=XMLBuffer.SUBELEMENTS;
				node.left=v.replace(node.left);
				if (node.left.type==opType && node.left[E]) {
					e=e.concat(node.left[E]);
				} else {
					e.push({value:node.left});
				}
				e.push({name:"op", value:node.op});
				node.right=v.replace(node.right);
				if (node.right.type==opType && node.right[E]) {
					e=e.concat(node.right[E]);
				} else {
					e.push({value:node.right});
				}
				node[E]=e;
				return node;
			};
		}
		flatten(ARI);
		flatten(OAND);
		flatten(OOR);
		function flatten2(parent,child) {
			vf[parent]=function (node) {
				var es=XMLBuffer.orderByPos(node);
				var E=XMLBuffer.SUBELEMENTS;
				//if (!node[E]) node[E]=[];
				var newe=[];
				for (var i=0 ; i<es.length ; i++) {
					var e= v.replace(es[i]);
					console.log("i="+i+" parent = "+parent+ " child = "+child+" e.value.type="+e.value.type);
					if (e.value.type==child) {
						newe=newe.concat( XMLBuffer.orderByPos(e.value) );
					} else {
						newe.push(e);
					}
				}
				node[E]=newe;
				return node;
			};
		}
		flatten2("functionDecl","functionDeclHead");
		/*vf.functionDeclHead=function (node) {
			if (node.retName.ret) {
				node.returnType=node.retName.ret;
				node.name=node.retName.name;
			} else {
				node.name=node.retName;
			}
			delete node.retName;
			return node;
		};*/
		v=Visitor(vf);
		res.result[0]=v.replace(res.result[0]);
		if (res.isSuccess() ) {
			var node=res.result[0];
			var xmlsrc=$.genXML(str, node);
			return xmlsrc;
			//return eval("var r="+xmlsrc+"; r"); //"RES="+disp(res.result[0]);
		}
		return "ERROR\nSyntax error at "+res.src.maxPos+"\n"+res.src.str.substring(0,res.src.maxPos)+"!!HERE!!"+res.src.str.substring(res.src.maxPos);
	};
	$.genXML= function (src, node) {
		var x=XMLBuffer(src) ;
		x(node);
        return "<all>"+x.buf+"</all>";
	};
	$.extension="c";
	return $;
}();
