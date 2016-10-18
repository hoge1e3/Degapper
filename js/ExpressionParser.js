
function ExpressionParser(element) {
    var pp;
    try {pp=Parsec2;} catch(e) {pp=Parser;}

	var $={g:{},types:{}};
	var g=$.g;
	var types=$.types;
	var sgn=1;
	//  first 10     *  +  <>  &&  ||  =     0  later
	$.smallerFirst = function () {
		//  first 0     *  +  <>  &&  ||  =     10 later
		sgn=-1;
		return $;
	};
	function reg(prio, type, op) {
		if (!types[prio]) types[prio]=type;
		if (types[prio]!==type) throw "Prio : "+prio+" is already reged for "+types[prio];
		var eop=g[prio];
		if (!eop) g[prio]=op;
		else {
			g[prio]=eop.or(op);
		}
	}
	$.element=function (e) {
		if (!element) element=e;
		else element=element.or(e);
	};
	$.getElement=function () {return element;};
	$.prefix=function (prio, pre) {
       reg(prio, "prefix", pre);
	};
	$.postfix=function (prio, post) {
       reg(prio, "postfix", post);
	};
	$.infixl =function (prio, inf) {
	       reg(prio, "infixl", inf);
	};
	$.infixr =function (prio, inf) {
	       reg(prio, "infixr", inf);

	};
	$.infix =function (prio, inf) {
	       reg(prio, "infix", inf);

	};
	$.custom = function (prio, func) {
		// func :: Elem(of next higher) -> Parser
	};
	$.def={};
	$.def.infix = function (op, elem) {
		return elem.and(op.and(elem).ret(function (o,r) {return {op:o, right:r};}).opt()).ret(function(left, t) {
				if (t==null) return left;
				var res=$.mkInfix.def(left, t.op, t.right);//  {type:"infix", op:t.op, left: left, right: t.right};
				return res;
		});
	};
	$.mkInfix=function (f) {
		$.mkInfix.def=f;
	};
	$.mkInfix.def=function (left,op,right) {
		return {type:"infix", op:op, left: left, right: right};
	}
	$.mkInfixl=function (f) {
		$.mkInfixl.def=f;
	};
	$.mkInfixl.def=function (left, op , right) {
		return {type:"infixl",op:op ,left:left, right:right};
	};
	$.def.infixl = function (op, elem) {
		return elem.sep1(op, false).ret(function(r) {
			var tails=r.tails;
			//console.log("r.t.length="+tails.length);
			if (tails.length==0) return r.head;
			var res=r.head;
			var i=0;
			while (i<tails.length) {
				res=$.mkInfixl.def(res,  tails[i].sep, tails[i].value);
				//res={type:"infixl",op:tails[i].sep,left:res, right:tails[i].value};
				i++;
			}
			return res;
		});
	};
	$.mkInfixr=function (f) {
		$.mkInfixr.def=f;
	};
	$.mkInfixr.def=function (left, op , right) {
		return {type:"infixr",op:op ,left:left, right:right};
	};
	$.def.infixr = function (op, elem) {
		return elem.sep1(op, false).ret(function(r) {
			var tails=r.tails;
			//console.log("r.t.length="+tails.length);
			if (tails.length==0) return r.head;
			var i=tails.length-1;
			var res=tails[i].value;
			while (i>=0) {
				var op=tails[i].sep;
				i--;
				var left=(i>=0? tails[i].value : r.head);
				res=$.mkInfixr.def(left, op,  res);
				//res={type:"infixr",op:op, left:left, right: res};
			}
			return res;
		});
	};
	$.mkPrefix=function (f) {
		$.mkPrefix.def=f;
	};
	$.mkPrefix.def=function (op , right) {
		return pp.setRange({type:"prefix", op:op, right:right});
	};
	$.def.prefix= function (op, elem) {
		var res=op.rep0().and(elem).ret(function (ops,elem) {
			var res=elem;
			for (var i=ops.length-1 ; i>=0 ;i--) {
				res=$.mkPrefix.def(ops[i], res);
				//res={type:"prefix", op:ops[i], right:res};
			}
			return res;
		});
		var f=op.or(elem);
		res._first=f._first;
		return res;
	};

	$.mkPostfix=function (f) {
		$.mkPostfix.def=f;
	};
	$.mkPostfix.def=function (left, op) {
		return pp.setRange({type:"postfix", left:left, op:op});
	};

	$.def.postfix = function (op, elem) {
		return elem.and(op.rep0()).ret(function (elem,ops) {
			var res=elem;
			for (var i=0 ; i<ops.length; i++) {
				res=$.mkPostfix.def (res, ops[i]);
//				res={type:"postfix",left:res,op:ops[i]};
			}
			return res;
		});
	};
	$.build= function () {
		var gs=[];
		for (var i in g) {
			gs.push({prio:i, op:g[i]});
		}
		gs.sort(function (a,b) { return (b.prio-a.prio)*sgn;  });
		var e=element;//.tap("elem");
		for (var i=0 ; i<gs.length ; i++) {
			var prio=gs[i].prio;
			var op = gs[i].op;
			op.prio=prio;
			if (op._first) console.log("prio: "+prio+" fst="+pp.dispTbl(op._first.tbl));
			e=$.def[types[prio]](op,e);
		}
		//console.log(" exparser:: build   fst="+disp(e._first));
		return 	$.built=e;
	};
	$.lazy = function () {
		return pp.Parser.create(function (st) {
			return $.built.parse(st);
		});
	};
	return $;
}