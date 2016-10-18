/**
 * Copyright (c) 2007, Yusuke Inuzuka<yuin@inforno.net>(http://inforno.net/)
 *
 * License :
 *   Articstic License 2.0
 *
 * Modified by cho
 * Original Version: http://inforno.net/static/files/parsec.js
 * - move rep0, sep0 into Parser
 * - add new method: opt into Parser
 * - add new method: strLike into PS
 */
Parsec2=function () {
	var SUCC=true,FAIL=false;
        /****************************************************************/
    var $ = {
        extend : function(dest, src) { var i; for(i in src){dest[i] = src[i];} return dest; },
        inherit: function(child, parent) {
            this.extend(child, parent);
            var dummy = function(){};
            dummy.prototype = parent.prototype;
            child.prototype = new dummy();
            child.prototype.constructor = child;
            child.prototype.__super__ = parent.prototype;
            return child;
        },
        consoleBuffer:"",
        options: {traceTap:false, optimizeFirst: true, profile: false ,verboseFirst: false},
    };
    $.dispTbl=function (tbl) {
    	var buf="";
    	var h={};
    	if (!tbl) return buf;
    	for (var i in tbl) {
    		var n=tbl[i].name;
    		if (!h[n]) h[n]="";
    		h[n]+=i;
    	}
    	for (var n in h) {
    		buf+=h[n]+"->"+n+",";
    	}
    	return buf;
    }
    //var console={log:function (s) { $.consoleBuffer+=s; }};
    function _debug(s) {console.log(s);}
    /*********************************************
     * Parser
     *********************************************/
    var P = $.Parser = function(){};
    P.create = function(parse) { // (State->State)->Parser
        var p = new P;
        p.parse = parse;
        return p;
    };
    function nc(v,name) {
    	if (v==null) throw name+" is null!";
    	return v;
    }
    $.extend(P.prototype, {// class Parser
        parse : function(s){ throw "abstract"; },// Parser.parse:: State->State
        except: function (f) {
        	var self=this;
        	return P.create(function (s) {
        		var res=self.parse(s);
        		if (f.apply({}, res.result)) {
        			res.success=FAIL;
        		}
        		return res;
        	}).setName("except");
        },
        and : function(q) {// Parser.and:: (Function|Parser)  -> Parser
        	nc(q,"q"); // q==next
        	var self = this; // Parser
            var res=P.create(function(s){ //s:State
            	var m = self.parse(s); // m:State
                if (!m.success) return m;
                else {
                    if(q.constructor == Function) { // for ret func
                        return $.extend(m.clone(), {result: [q.apply({},m.result)] });
                    }
                    var m2 = q.parse(m); //m2:State
                    if (!m2.success) return m2;
                    else {
                        m2.result = m.result.concat(m2.result); // concat===append built in func in Array
                        return m2;
                    }
                }
            });
            res._first=this._first;
            return res.setName("("+this.name+" "+q.name+")");
        },
        first: function (space, ct) {
        	if (space==null) throw "Space is null2!";
        	if (typeof ct=="string") {
        		this._first={space: space, chars:ct};
        	} else {
        		this._first={space: space, tbl:ct};
        	}
        	return this;
        },
        inheritFirst: function (p) {
            this._first=p._first;
            return this;
        },
        unifyFirst: function (q) {
        	//return null;
        	var tbl={}; // tbl.* includes tbl.ALL
        	function setTbl(src) {// src:Parser
        		var cs=src._first.chars;
        		function mk(c) {
        			if (!tbl[c]) {
        				if (!tbl.ALL) tbl[c]=src;
        				else tbl[c]=tbl.ALL.orNoUnify(src);
        			} else {
        				tbl[c]=tbl[c].orNoUnify(src);
        			}
        		}
        		if (cs) {
            		for (var i=0; i<cs.length ; i++) {
            			var c=cs.substring(i,i+1);
            			mk(c);
            		}
            	} else {
        			mk("ALL");
        			for (var i in tbl) {
        				if (i==="ALL") continue;
        				tbl[i]=tbl[i].orNoUnify(src);
        			}
            	}
        	}
        	function mergeTbl() {
        		var t2=q._first.tbl;
        		if ("ALL" in t2) {
            		for (var c in tbl) {
            			tbl[c]=tbl[c].orNoUnify(q);
            		}
            		for (var c in t2) {
            			if (!tbl[c]) {
            				tbl[c]=q;
            			}
            		}
        		} else {
        			for (var c in t2) {
        				if (!tbl[c]) {
        					tbl[c]=q;
        				} else {
        					tbl[c]=tbl[c].orNoUnify(q);
        				}
        			}
        		}
        	}
        	if (!this._first) return null;
        	if (!q._first) return null;
        	var space=this._first.space;
        	if (space!==q._first.space) return null;
        	if (space==null) throw "Space is null!";
        	if (this._first.tbl) $.extend(tbl, this._first.tbl);
        	else setTbl(this);
        	if (q._first.tbl) mergeTbl();
        	else setTbl(q);
        	var res=P.create(function (s0) {
        		var s=space.parse(s0);
        		var f=s.src.str.substring(s.pos,s.pos+1);
        		//console.log("name= "+this.name+" pos="+s.pos+" fst="+f+"  tbl="+$.dispTbl(tbl));
        		if (tbl[f]) {
            		//console.log("tbl[f].name="+tbl[f].name);
            		return tbl[f].parse(s);
        		}
        		if (tbl.ALL) return tbl.ALL.parse(s);
        		s.success=FAIL;
        		return s;
        	});
        	res.first(space, tbl).setName("("+this.name+")U("+q.name+")");
        	if ($.options.verboseFirst) console.log("Created unify name=" +res.name+" tbl="+$.dispTbl(tbl));
        	return res;
        },
        or : function(q) { // Parser->Parser
        	nc(q,"q"); // q==otherwise
        	var u=($.options.optimizeFirst ? this.unifyFirst(q) : null);
        	if (u) return u;
        	else return this.orNoUnify(q);
        },
        orNoUnify: function (q) {
           	var self = this;  // self:Parser
        	var res=P.create(function(s){
        		var m = self.parse(s); // m:State
        		if (!m.success){
        			var m2 = q.parse(s); // m2:State
        			return m2;
        		} else {
        		    return m;
        		}
        	});
        	res.name="("+this.name+")|("+q.name+")";
        	return res;
        },
        setName: function (n) {
        	this.name=n;
        	return this;
        },
        profile: function () {
            if ($.options.profile) {
                this.parse=this.parse.profile(this.name);
            }
        	return this;
        },
        repN : function(min){
        	var p = this;
        	if (!min) min=0;
        	var res=P.create(function(s) {
        		var current = s;
        		var result = [];
        		while(true){
        			var next = p.parse(current);
        			if(!next.success) {
        				var res;
        				if (result.length>=min) {
        					res=current.clone();
        					res.result = [result];
        					res.success=SUCC;
        					//console.log("rep0 res="+disp(res.result));
        					return res;
        				} else {
        					res=s.clone();
        					res.success=FAIL;
        					return res;
        				}
        			} else {
        				result.push(next.result[0]);
        				current = next;
        			}
        		}
        	});
        	if (min>0) res._first=p._first;
        	return res.setName("("+p.name+" * "+min+")");
        },
        rep0: function () { return this.repN(0); },
        rep1: function () { return this.repN(1); },
        opt: function () {
        	var p=this;
        	return P.create(function (s) {
        		var r=p.parse(s);
        		if (r.success) {
        			return r;
        		} else {
        			s=s.clone();
        			s.success=SUCC;
        			s.result=[null];
        			return s;
        		}
        	}).setName("("+p.name+")?");
        },
        sep1  : function(s, ignoreSep) {
        	var p=this;
        	nc(p,"p");nc(s,"s");
            return (p) .and (
                    (s) .and (p) .ret(function(r1, r2) {
                        if(ignoreSep) return r2;
                        //_debug("sep: "+r1+" val:"+r2);
                        return {sep:r1, value:r2};
                    }).repN(0)
            ) .ret(function(r1, r2){
            	//_debug("sep1 Succ "+disp(r1));
            	var i;
                if (ignoreSep) {
            		var r=[r1];
            		if (r2) {
            			for (i in r2) {
            				r.push(r2[i]);
            			}
            		}
            		return r;
            	} else {
            		if (!r2) return {head:r1,tails:[]};
            		var r22=[];
            		for (i in r2) {
            			r22.push(r2[i][0]);
            		}
            		return {head:r1,tails:r2};
            	}
            }).setName("(sep1 "+p.name+"~~"+s.name+")");
        },
        sep0: function(s){
        	return this.sep1(s,true).opt().ret(function (r) {
        		if (!r) return [];
        		return r;
        	});
        },
        tap: function (msg) {
        	if (!$.options.traceTap) return this;
        	if (!msg) msg="";
        	var self=this;
        	var res=P.create(function(s){
        		console.log("tap:"+msg+" name:"+self.name+"  pos="+(s?s.pos:"?"));
        		var r=self.parse(s);
        		var img=r.src.str.substring(r.pos-3,r.pos)+"^"+r.src.str.substring(r.pos,r.pos+3);
        		console.log("/tap:"+msg+" name:"+self.name+" pos="+(s?s.pos:"?")+"->"+(r?r.pos:"?")+" "+img+" res="+(r?r.success:"?"));
        		return r;
        	});
        	res._first=this._first;
        	return res.setName("(Tap "+self.name+")");
        },
        retN: function (i) {
        	return this.ret(function () {
        		return arguments[i];
        	})
        }
    });
    P.prototype.ret = P.prototype.and;
    /*********************************************
     * ParseState
     *********************************************/
    var ST = $.ParseState = function(str) { // class ParseState
    	// pos:int result:[Object] success:(fail/succ)  pre?
        $.extend(this, { src:{str:str, maxPos:0}, pos:0,result:[], success:SUCC, pre:{}}); // maxPos is shared by all state
    };
    $.extend(ST.prototype, {
        fail     : function(){return this.success == FAIL;},
        success  : function(){return !this.fail();},
        clone : function() {
            var s =new ST();
            var i;
            for(i in this){
                if(this[i].constructor==Array) s[i] = this[i].slice();
                else s[i] = this[i];
            }
            return s;
        },
        updateMaxPos:function (npos) {
        	if (npos > this.src.maxPos) {
        		this.src.maxPos=npos;
        		//console.log("parsec2:updateMaxPos "+npos);
        	}
        },
        isSuccess: function () {
        	return this.success==SUCC;
        }
    });
    /*********************************************
     * StringParser, keeps Source and maxpos ( not in state)
     *********************************************/
    var PS=$.StringParser= {
        define : function(f) {
            var ChildParsers = function(s){
                this.__super__.constructor.call(this, s);
                f.call(this);
            };
            $.inherit(ChildParsers, PS);
            return ChildParsers;
        },
        empty: P.create(function(state) {
        	var res=state.clone();
        	res.success=SUCC;
        	res.result=[null]; //{length:0, isEmpty:true}];
        	return res;
        }).setName("E"),
    	fail  : P.create(function(s){return $.extend(s,{success:FAIL});}).setName("F"),

        str: function (st) { // st:String
        	return this.strLike(function (str,pos) {
        		//console.log("str: strlike"+str);
        		if (str.substring(pos, pos+st.length)===st) return {len:st.length};
        		return null;
        	});
        },
        reg: function (r) {//r: regex (must have ^ at the head)
        	//console.log(r+"");
        	if (!(r+"").match(/^\/\^/)) console.log("Waring regex should have ^ at the head:"+(r+""));
        	return this.strLike(function (str,pos) {
        		var res=r.exec( str.substring(pos) );
        		if (res) {
        			res.len=res[0].length;
        			return res;
        		}
        		return null;
        	});
        },
        strLike: function (func) {
        	// func :: str,pos, state? -> {len:int, other...}  (null for no match )
            return P.create(function(state){
                var str= state.src.str; //self.src;
                if (str==null) throw "strLike: str is null!";
                var spos=state.pos;
                //console.log(" strlike: "+str+" pos:"+spos);
                var m=func(str, spos, state);
                if ($.options.traceToken) console.log("pos="+spos+" r="+m);
                if(m) {
                	if ($.options.traceToken) console.log("str:succ");
                	m.pos=spos;
                	m.src=state.src; // insert 2013/05/01
                	var ns=state.clone();
                    $.extend(ns, {pos:spos+m.len, success:SUCC, result:[m]});
                    state.updateMaxPos(ns.pos);
                    return ns;
                }else{
                	if ($.options.traceToken) console.log("str:fail");
                    state.success=FAIL;
                    return state;
                }
            }).setName("STRLIKE");
        },
    	parse: function (parser, str) {
    		var st=new ST(str);
    		return parser.parse(st);
    	}

    };
    PS.eof=PS.strLike(function (str,pos) {
    	if (pos==str.length) return {len:0};
    	return null;
    }).setName("EOF");

    $.lazy=function (pf) { //   ( ()->Parser ) ->Parser
    	var p=null;
    	return P.create(function (st) {
    		if (!p) p=pf();
    		if (!p) throw pf+" returned null!";
    		this.name=pf.name;
    		return p.parse(st);
    	}).setName("LZ");
    };
    $.addRange=function(res, newr) {
    	if (newr==null) return res;
    	if (typeof (res.pos)!="number") {
    		res.pos=newr.pos;
    		res.len=newr.len;
    		return res;
    	}
    	var newEnd=newr.pos+newr.len;
    	var curEnd=res.pos+res.len;
    	if (newr.pos<res.pos) res.pos=newr.pos;
    	if (newEnd>curEnd) res.len= newEnd-res.pos;
    	return res;
    };
    $.setRange=function (res) {
    	if (res==null || typeof res=="string" || typeof res=="number") return;
    	var exRange=$.getRange(res);
    	if (exRange!=null) return res;
    	for (var i in res) {
    		if (!res.hasOwnProperty(i)) continue;
    		var range=$.setRange(res[i]);
    		Parsec2.addRange(res,range);
    	}
    	return res;
    };

	$.getRange=function(e) {
    	if (e==null) return null;
    	/*if (e instanceof Array && (e.pos!="number" || e.len!="number")) {
    		var res={};
    		e.forEach(function (ee) { $.addRange(res,ee); });
    		if (e.pos!="number" || e.len!="number") return null;
    		return res;
    	}*/
		if (typeof e.pos!="number") return null;
		if (typeof e.len=="number") return e;
		//if (typeof e[0]=="string") return {pos:e.pos,len:e[0].length};
		return null;
	};
    return $;
    /****************************************************************/
}();
