// This program is under development do not use.
sys.load("js/parser.js");
sys.load("js/ExpressionParser2.js");
//sys.load("js/Grammar.js");
sys.load("js/XMLBuffer.js");
sys.load("js/IndentBuffer.js");
sys.load("js/disp.js");
sys.load("js/profiler.js");

CKR2=function () {
    var p=Parser;
    var $={};
    var gr={};
    var noSingleList=false;
    function makeNode(name, elements) {
        var res={type:name};
        for (var i=0 ; i<elements.length ;i++) {
            var e=elements[i];
            var rg=p.setRange(e);
            p.addRange(res, rg);
            res["-element"+i]=e;
        }
        for (var i=0 ; i<elements.length ;i++) {
            var e=elements[i];
            if (!e) continue;
            var t=e.type;
            if (XMLBuffer.isValidTagName(t) &&
                    e.pos==res.pos &&
                    e.len==res.len ) {
                return e;
            }
        }
        //if (typeof res.pos!="number") throw "Range is not set on "+name;
        res.toString=function () {
            return "("+this.type+")";
        };
        return res;
    }
    function g(name, parser) {
        return gr[name]=parser.ret(function () {
            return makeNode(name, arguments);
        }).setName(name).tap(name);
    }
    function G(name) {
        if (gr[name]) return gr[name];
        return p.lazy(function () {
            var r=gr[name];
            if (!r) throw "grammar named '"+name +"' is undefined";
            return r;
        });
    }
    function plural(singular,plural) {
        if(!plural) plural=singular+"_list";
        return gr[plural]= G(singular).rep1().ret(
                makeRepNodeF(plural)
        ).setName(plural);
    }
    function makeRepNodeF(name) {
        return function (r) {
            if (noSingleList && r.length<2) return makeNode(null, r);
            return makeNode(name, r);
        }
    }

    var sp=p.StringParser;//(str);
    var spaceCache={};
    var spaceRaw=sp.reg(/^(\s*(\/\*([^\/]|[^*]\/|\r|\n)*\*\/)*(\/\/.*\n)*)*/);
    var space=Parser.create(function (s) {
        /*var res=spaceCache[s.pos];
        if (res) {
            res.success=true;
            return res;
        }*/
        res=spaceRaw.parse(s);
        //spaceCache[s.pos]=res;
        return res;
    }).setName("space").profile();
    //var space=sp.reg(/^(\s*(\/\*([^\/]|[^*]\/|\r|\n)*\*\/)*(\/\/.*\n)*)*/).setName("space").profile();
    function tk(r, name) {
        if (!name) {
            name=r+"";
            if (name.length>20) throw "NAME is too long:"+name;
        }
        var pat;
        var fst;
        if (typeof r=="string") {
            pat=sp.str(r);
            if (r.length>0) fst=r.substring(0,1);
        } else {
            pat=sp.reg(r);
        }
        var res=space.and(pat).ret(function(a, b) {
            var res={};
            res.pos=b.pos;
            res.len=b.len;
            res.type=name;
            res.text=b.src.str.substring(res.pos, res.pos+res.len);
            res.toString=function (){
                return this.text;//+"("+this.pos+")";
            };
            return res;
        });
        if (fst) res.first(space, fst);
        return res.setName(name).profile().tap(name);
    }
    var COM=tk(",","COMMA");
    function commaSep(singular, plural ){
        if(!plural) plural=singular+"_list";
        return gr[plural]= G(singular).sep1(COM, true).ret(function (r) {
            if (noSingleList && r.length==1) return r[0];
            return makeNode(plural, r);
        }).setName(plural);
    }

    function ands() {
        var pa;
        for (var i=0 ; i<arguments.length ; i++) {
            p.nc(arguments[i], "ands:arg["+i+"]");
            if (!pa) pa=arguments[i];
            else pa=pa.and(arguments[i]);
        }
        return pa.ret(function () {
            return makeNode(null,arguments);
        });
    }
    function ors() {
        var pa;
        for (var i=0 ; i<arguments.length ; i++) {
            p.nc(arguments[i], "ors:arg["+i+"]");
            if (!pa) pa=arguments[i];
            else pa=pa.or(arguments[i]);
        }
        return pa;
    }
    var reserved={"function":true, "var":true , "return":true, "typeof": true, "if":true,
                 "for":true,
                 "while":true,
                 "break":true,
                 "do":true,
                 "switch":true,
                 "try": true,
                 "catch": true,
                 "finally": true,
                 "in": true,
                 "instanceof":true,
                 "auto":true, "register":true,
                 "static":true,
                 "extern":true, "typedef":true,
                 "sizeof": true,
                 "using": true, "namespace": true, // cpp

    };
    var SC=tk(";","SEMICOLON");
    var LP=tk("(","LEFT_PAR");
    var RP=tk(")","RIGHT_PAR");
    var LC=tk("{","LEFT_CURL");
    var RC=tk("}","RIGHT_CURL");
    var LB=tk("[","LEFT_BRACKET");
    var RB=tk("]","RIGHT_BRACKET");

    var number_constant=tk(/^[0-9\.]+/,"NUM").ret(function (n) {
        n.type="number";
        n.value=parseInt(n.text);
        //console.log("n.val="+n.value);
        return n;
    }).first(space,"0123456789");
    var identifier=tk(/^[a-zA-Z_][a-zA-Z0-9_]*/, "IDENT").except(function (s) {
        return reserved.hasOwnProperty(s.text);
    }).first(space,"_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$").setName("symbol");
    var string=tk({exec: function (s) {
        var head=s.substring(0,1);
        if (head!=='"' /*&& head!=="'"*/) return false;
        for (var i=1 ;i<s.length ; i++) {
            var c=s.substring(i,i+1);
            if (c===head) {
                return [s.substring(0,i+1)];
            } else if (c==="\\") {
                i++;
            }
        }
        return false;
    },toString:function(){return"/^literal";}
    },"literal").first(space,"\"'");
    var character_constant=tk(/^'([^'\\]|\\.)'/,"CHAR").ret(function (s) {
        s.type="character_constant";
        return s;
    });
    var assignment_operator=g("assignment_operator", ors(
            tk("=","ASSIGN"), tk("*=","MUL_ASSIGN"),
            tk("/=","DIV_ASSIGN"), tk("%=","MOD_ASSIGN"),
            tk("+=","ADD_ASSIGN"), tk("-=","SUB_ASSIGN"),
            tk("<<=","LSHIFT_ASSIGN"), tk(">>=","RSHIFT_ASSIGN"),
            tk("&=","AND_ASSIGN"), tk("^=","XOR_ASSIGN"),
            tk("|=","OR_ASSIGN")
    ));
    var assignment_expression=g("assignment_expression",ands(
            G("conditional_expression"),
            ands(assignment_operator, G("assignment_expression")).opt()
    ));
    var expression=commaSep("assignment_expression", "expression");
    var loep=ExpressionParser();
    loep.mkInfix(mki);
    loep.mkInfixl(mki);
    loep.mkInfixr(mki);
    function mki(left, op ,right) {
        var type=op.type;
        if (op_tbl[type]) type=op_tbl[type];
        type+="_expression";
        return makeNode(type,[left,op,right]);
    }
    loep.mkPrefix(function (op, right) {
        return makeNode("prefix_expression",[op,right]);
    });
    loep.mkPostfix(function (left, op) {
        return makeNode("postfix_expression",[left,op]);
    });
    var logial_OR_expression=loep.lazy();
    var prio=0;
    var conditional_expression=g("conditional_expression",
            logial_OR_expression,
            ands(tk("?"), expression,
                 tk(":"), G("conditional_expression")
                ).opt()  );
    loep.infixl(prio, ors(tk("||","LOG_OR")));
    prio++;
    loep.infixl(prio, ors(tk("&&","LOG_AND")));
    prio++;
    loep.infixl(prio, ors(tk("|","BIT_OR")));
    prio++;
    loep.infixl(prio, ors(tk("^","BIT_XOR")));
    prio++;
    loep.infixl(prio, ors(tk("&","BIT_AND")));
    prio++;
    loep.infixl(prio, ors(tk("==","EQ"),tk("!=","NE")));
    prio++;
    var LT=tk("<","LT").noFollow(sp.str("<")).tap("LT");
    var GT=tk(">","GT").noFollow(sp.str(">")).tap("GT");

    loep.infixl(prio, ors(tk("<=","LE"),tk(">=","GE"),LT,GT)
            );
    prio++;
    loep.infixl(prio, ors(tk("<<","LSHIFT"),tk(">>","RSHIFT")));
    prio++;
    var PLUS=tk("+","PLUS").noFollow(sp.str("+"));
    var MINUS=tk("-","MINUS").noFollow(sp.str("-"));

    loep.infixl(prio, ors(PLUS,MINUS));
    prio++;
    loep.infixl(prio, ors(tk("*","MUL"),tk("/","DIV"),tk("%","MOD")));
    prio++;
    loep.prefix(prio, ands(LP, G("type_name"), RP) );
    prio++;
    var op_tbl={EQ:"equality", NE:"equality",
            LE: "relational", LT:"relational", GE:"relational" ,GT :"relational",
            LSHIFT: "shift", RSHIFT: "right",PLUS:"additive", MINUS:"additive",
            MUL:"multiplicative",DIV:"multiplicative", MOD:"multiplicative"
    }
    var unary_operator=g("unary_operator",ors(
            tk("&"),tk("*"),tk("+"),tk("-"),tk("~"),tk("!")
            ));
    loep.prefix(prio, ors(
            tk("++"),tk("--"),
            unary_operator,   // !differ from k&r  (unary_operator cast_expression)
            tk("sizeof")
            // !differ from k&r: sizeof(type_name) is omitted
    ));
    prio++;
    var argument_expression_list=commaSep("assignment_expression", "argument_expression_list");
    loep.postfix(prio, ors(
        ands(LB, expression, RB),
        ands(LP, argument_expression_list.opt(), RP),
        ands(tk("."), identifier),
        ands(tk("->"), identifier),
        tk("++"),
        tk("--")
        ));

    var constant=g("constant", ors(
            number_constant,
            character_constant
            //enumeration_constant
            ));
    var constant_expression=constant;  // k&r defines constant_expression:=conditional_expression.  why?
    var primary_expression=g("primary_expression",   ors(
        identifier,
        constant,
        string,
        ands(LP, expression, RP)
     ));
    loep.element(primary_expression);
    logial_OR_expression=loep.build();

    // --------------

    var reserved={"int":true , "double": true, "float": true, "char":true, "void":true,  "return":true, "typeof": true, "if":true,
            "for":true,
            "while":true,
            "break":true,
            "do":true,
            "switch":true
    };
    var type_symbol = identifier;
    function builtinType(s) {
        type_symbol=type_symbol.or(tk(s ,s ));
    }
    builtinType("int");
    builtinType("double");
    builtinType("float");
    builtinType("char");
    builtinType("void");

    var statement=G("statement");
    //---------------
    var continue_statement=g("continue_statement", ands(
            tk('continue'), SC));

    var break_statement=g("break_statement", ands(
            tk('break'), SC));

    var return_statement=g("return_statement", ands(
        tk('return'),  expression.opt(), SC));

    var jump_statement=g("jump_statement", ors(
        continue_statement,
        break_statement,
        return_statement));

    var for_statement=g("for_statement", ands(
        tk('for'), LP,
        ors(G("declaration"),ands(expression,SC)).opt(),//cpp
        expression.opt(), SC,
        expression.opt(), RP,
        statement));

    var do_statement=g("do_statement", ands(
        tk('do'),  statement , tk('while'), LP, expression , RP
        )) ;

    var while_statement=g("while_statement", ands(
        tk('while'), LP,  expression, RP,  statement));

    var iteration_statement=g("iteration_statement",ors(
        while_statement,
        do_statement,
        for_statement));

    var switch_statement=g("switch_statement", ands(
        tk('switch'), LP,  expression, RP,  statement
        ))

    var if_statement=g("if_statement",ands(
         tk("if"),  LP,  expression, RP, statement,
         ands(tk("else") , statement).opt()
    ));

    var selection_statement=g("selection_statement",ors(
        if_statement,
        switch_statement
        ));

    var statement_list=plural("statement");

    var compound_statement=g("compound_statement", ands(
            LC,
            ors(G("declaration"), statement).rep0(),
            RC
    ));

    var expression_statement=g("expression_statement",
        ands( expression.opt(), SC
                ))

    var default_statement=g("default_statement", ands(
            tk("default"), tk (":") , statement
            ));

    var case_statement=g("case_statement", ands(
         tk("case"), constant_expression , tk (":") , statement
         ));

    var labeled_statement=g("labeled_statement", ors(
            case_statement, default_statement
    ));
    var statement=g("statement", ors(
            labeled_statement, expression_statement,
            compound_statement, selection_statement,
            iteration_statement, jump_statement
    ));
    var typedef_name=g("typedef_name", identifier);

    var direct_abstract_declarator=g("direct_abstract_declarator", ors(
        ands(LB,  G("constant_expression").opt() ,RB ) ,
        ands(LP,  G("parameter_type_list").opt() ,RP )
//        ands(sp("("),  abstract_declarator ,sp(")") ),
    ).rep0().ret(makeRepNodeF()));

    var abstract_declarator=g("abstract_declarator" ,
        ands( G("pointer").opt(),  direct_abstract_declarator )
        );
    var type_name=g("type_name", ands(
        G("specifier_qualifier_list"), abstract_declarator.opt() ));

    var initializer_list=commaSep("initializer");
    var initializer = g("initializer", ors(
            assignment_expression,
            ands( LC , initializer_list , RC )
    ));
    var identifier_list = g("identifier_list", identifier.sep1(COM,true));
    var parameter_declaration=g("parameter_declaration",ands(
        G("declaration_specifiers"),  ors( G("declarator"), abstract_declarator.opt() )
        ));
    // int const ..
    var parameter_list = commaSep("parameter_declaration", "parameter_list");
    var parameter_type_list=g("parameter_type_list",ands(
            parameter_list, ands(tk(","),tk("...")).opt()
    ));
    var type_qualifier_list=plural("type_qualifier");
    var pointer = g("pointer", ands( tk("*"), type_qualifier_list.opt()).rep1().ret(makeRepNodeF()) );

    var decl_tail = ors(
            ands( LB , constant_expression.opt() , RB),
            ands( LP , parameter_type_list , RP) ,
            ands( LP,  identifier_list.opt() ,RP)
           // ands( LP,   )
    );
    var direct_declarator = g("direct_declarator", ands(
                identifier, decl_tail.rep0().ret(makeRepNodeF())
    ));
    var declarator = g("declarator", ands( pointer.opt(), direct_declarator));  // *a[5]
    var specifier_qualifier_list=plural("specifier_qualifier");
    var specifier_qualifier= g("specifier_qualifier", ors(  G("type_specifier") , G("type_qualifier")));
    var init_declarator = g("init_declarator", ands(
            declarator, tk("=").and(initializer).opt()  ));
    var init_declarator_list=commaSep("init_declarator");
    // skip struct
    var type_qualifier=g("type_qualifier", ors(tk("const"),tk("volatile")));
    var type_specifier=g("type_specifier",ors(
            tk("unsigned"), type_symbol
            /*struct_or_union_specifier, enum_specifier,*/
    ));
    var storage_class_specifier=g("storage_class_specifier",ors(
            tk("auto"), tk("register"), tk("static"), tk("extern"), tk("typedef")
    ));
    var declaration_specifiers=g("declaration_specifiers", ands(
            ors(storage_class_specifier, type_qualifier).rep0().ret(makeRepNodeF())
            , type_specifier));
   // differ from k&r.  original  :
    /*var declaration_specifier=g("declaration_specifier", ors(
             storage_class_specifier,  // static
             type_specifier,  // int
             type_qualifier   // const / volatile
    )); // static / int/  const
    var declaration_specifiers=plural("declaration_specifier","declaration_specifiers");
    */
    var declaration=g("declaration", ands( declaration_specifiers,
            init_declarator_list.opt(), SC) );
    var declaration_list=plural("declaration");
    /* k&r original:
      var function_definition=g("function_definition", ands(
            declaration_specifiers.opt(), declarator,
            declaration_list.opt(), compound_statement
    ));
     */
    var function_definition=g("function_definition", ands(
            ors( ands( declaration_specifiers, declarator),
                    declarator),
            declaration_list.opt(), compound_statement
    )); // declaration_list is used in old style C
    var using_namespace=g("using_namespace", ands(
            tk("using"),tk("namespace"),identifier,SC
            )); // cpp
    var external_declaration = g("external_declaration", ors( function_definition, declaration, using_namespace) );
    var translation_unit= g("translation_unit", external_declaration.rep1().ret(makeRepNodeF()).and(space.and(sp.eof)) ) ;
//  g\("(\w+)   var $1=g\("$1

    $.parse = function (str) {
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
        str=preprocess(str);
        var res=sp.parse(translation_unit, str);
        console.log("POS="+res.src.maxPos);
        if (res.isSuccess() ) {
            var node=res.result[0];
            console.log("node="+disp(node));
            var xmlsrc=$.genXML(str, node);
            return "<program>"+xmlsrc+"</program>";
        }
        return "ERROR\nSyntax error at "+res.src.maxPos+
        "\n"+res.src.str.substring(0,res.src.maxPos)+"!!HERE!!"+
        res.src.str.substring(res.src.maxPos);
    };
    $.genXML= function (src, node) {
        var x=XMLBuffer(src) ;
        x(node);
        return x.buf;
    };
    $.extension="cpp";
    return $;
}();
