var Inforno={Parsec:{}};
Inforno.Parsec.init=function () {
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
        options: {traceTap:false},
    };
    var console={log:function (s) { $.consoleBuffer+=s; }};
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
                    res.type="fail";
                }
                return res;
            });
        },

        and : function(q) {// Parser.and:: (Function|Parser)  -> Parser
        	nc(q,"q"); // q==next
        	var self = this; // Parser
            return P.create(function(s){ //s:State
            	var m = self.parse(s); // m:State
                switch(m.type){
                case "fail"    : return m;
                case "success" :
                    if(q.constructor == Function) { // for ret func
                        return $.extend(m.clone(), {result: [q.apply({},m.result)] });
                    }
                    var m2 = q.parse(m); //m2:State
                    switch(m2.type) {
                    case "fail"    : return m2;
                    case "success" :
                        m2.result = m.result.concat(m2.result); // concat===append built in func in Array
                        return m2;
                    }
                }
            });
        },

        or : function(q) { // Parser->Parser
        	nc(q,"q"); // q==otherwise
        	var self = this;  // self:Parser
        	return P.create(function(s){
        		var m = self.parse(s); // m:State
        		switch(m.type){
        		case "fail" :
            		var m2 = q.parse(s); // m2:State
            		switch(m2.type) {
        			case "fail"    :
        				// return s; じゃないの？
        				if(m2.pos < m2.pre.pos) return m; // ???  :pre
        				else                    return m2;
        			case "success" : return m2;
        			}
        		default : return m;
        		}
        	});
        },
        tap: function (msg) {
        	if (!$.options.traceTap) return this;
        	var p=this.parse; // p:State->State
        	this.parse=function(s){
        		console.log("tap:"+msg+" pos="+(s?s.pos:"?"));
        		var r=p(s);
        		console.log("/tap:"+msg+" pos="+(s?s.pos:"?")+"->"+(r?r.pos:"?")+" res="+(r?r.type:"?"));
        		return r;
        	};
        	return this;
        }
    });
    P.prototype.ret = P.prototype.and;
    /*********************************************
     * ParseState
     *********************************************/
    var ST = $.ParseState = function() { // class ParseState
    	// pos:int result:[Object] type:(fail/succ)  pre?
        $.extend(this, {maxPos: {pos:0} ,pos :0,result:[], type:"success", pre:{}}); // maxPos is shared by all state
    };
    $.extend(ST.prototype, {
        fail     : function(){return this.type == "fail";},
        success  : function(){return !this.fail();},
        updateMaxPos: function () {
        	if (this.pos>this.maxPos.pos) {
        		this.maxPos.pos=this.pos;
        	}
        },
        clone : function() {
            var s =new ST();
            var i;
            for(i in this){
                if(this[i].constructor==Array) s[i] = this[i].slice();
                else s[i] = this[i];
            }
            return s;
        }
    });
    /*********************************************
     * Parsers
     *********************************************/
    var PS = $.Parsers = function(str) {
        this.state = null;
        var self   = this;
        self._chrLike = function(p) { //  (Char->Bool)->Parser
            return P.create(function(pre){
                if(!pre) pre = new ST;
                self.state = pre.clone();
                self.state.pre = pre;  // :pre
                var c = str.charAt(self.state.pos);
                if(self.state.pos <= str.length && p(c)) {
                    $.extend(self.state, {pos:self.state.pos+1, type:"success", result:[c]});
                    return self.state;
                }else{
                    self.state.type="fail";
                    return self.state;
                }
            });
        };

        self._reg=function (r) {
            return P.create(function(pre){
                if(!pre) pre = new ST;
                self.state = pre.clone();
                self.state.pre = pre;  // :pre
                var c = str.substring(self.state.pos);
                var mr;
                var spc=(r+""==="/^(\\s*(\\/\\*([^\\/]|[^*]\\/|\\r|\\n)*\\*\\/)*(\\/\\/.*\\n)*)*/");
                if (!spc&&$.options.traceToken) console.log("pos="+self.state.pos+" r="+r+"  c="+c.substring(0,40));
                if(self.state.pos <= str.length && (mr=r.exec(c))) {
                	if (!spc&&$.options.traceToken) console.log("reg:succ");
                	//console.log(" succ" + self.state.pos+"  ["+mr[0]+"]");
                	mr.pos=self.state.pos;
                    $.extend(self.state, {pos:self.state.pos+mr[0].length, type:"success", result:[mr]});
                    self.state.updateMaxPos();
                    return self.state;
                }else{
                	if (!spc&&$.options.traceToken) console.log("reg:fail");
                    self.state.type="fail";
                    return self.state;
                }
            });
        };
        self._str=function (r) { // r:String
            return P.create(function(pre){
                if(!pre) pre = new ST;
                self.state = pre.clone();
                self.state.pre = pre;   // :pre
                var c = str.substring(self.state.pos);
                if ($.options.traceToken) console.log("pos="+self.state.pos+" r="+r+"  c="+c);
                if(self.state.pos <= str.length && c.substring(0,r.length)===r ) {
                	if ($.options.traceToken) console.log("str:succ");
                	var mr={pos:self.state.pos};
                	mr[0]=r;
                    $.extend(self.state, {pos:self.state.pos+r.length, type:"success", result:[mr]});
                    self.state.updateMaxPos();
                    return self.state;
                }else{
                	if ($.options.traceToken) console.log("str:fail");
                    self.state.type="fail";
                    return self.state;
                }
            });
        };

        this.empty = P.create(function(state) {
        	//console.log("Empty - ps="+state.pos);
        	var res=state.clone();
        	res.type="success";
        	res.result=[{length:0, isEmpty:true}];
        	return res;
        	//return $.extend(self.state, {result:[""], type:"success"});
        });
        this.any = this.chrLike(function(c){return true;});
        this.eof = this.chrLike(function(c){return c=="";});
    };
    $.extend(PS, {
        define : function(f) {
            var ps = function(s){
                this.__super__.constructor.call(this, s);
                f.call(this);
            };
            $.inherit(ps, PS);
            return ps;
        },

        _rep : function(f) {
            return function(p){
                var self = this;
                return P.create(function(s) {// State->State
                	//nc(s,"s");
                	//var ss=s.clone();
                    var current = p.parse(s); // current:State
                    if(current.type=="fail") return f(current);
                    var result = [current.result];
                    while(1){
                        var next = p.parse(current);
                        switch(next.type) {
                        case "fail"     : current.result = [result];
                        return current;
                        case "success"  : result.push(next.result);
                        current = next;
                        }
                    }
                });
            };
        },
        _rep0 : function(p){
        	var self = this;
        	return P.create(function(s) {
        		var current = s;
        		var result = [];
        		while(1){
        			var next = p.parse(current);
        			switch(next.type) {
        			case "fail"     :
        				var res=current.clone();
        				res.result = [result];
        				res.type="success";
        				//console.log("rep0 res="+disp(res.result));
        				return res;
        			case "success"  : result.push(next.result[0]);
        			current = next;
        			}
        		}
        	});
        }

    });

    $.extend(PS.prototype, {
        Return : {
            str : function(){
                var result = [];
                var i,l;
                for(i=0,l=arguments.length;i<l;i++) {
                    if(arguments[i]) {
                        if(arguments[i].constructor == Array) {
                            result.push(arguments.callee.apply({},arguments[i]));
                        }else {
                            result.push(arguments[i]);
                        }
                    }
                }
                return result.join("");
            },
        },
        reg : function(f){nc(f,"f");var self=this; return self._reg(f);},
        str : function(f){nc(f,"f");var self=this; return self._str(f);},
        chrLike : function(f){nc(f,"f");var self=this; return self._chrLike(f).ret(self.Return.str);},
        chr     : function(c){nc(c,"c"); return this.chrLike(function(v){return v==c;});},
        /*str     : function(str) {
            var cs = str.split("");
            var p  = this.chr(cs[0]);
            for(var i=1,l=cs.length;i<l;i++) {
                p = p.and(this.chr(cs[i]));
            }
            return p.ret(this.Return.str);
        },*/
        fail  : P.create(function(s){return $.extend(s,{type:"fail"});}),
        opt   : function(p){nc(p,"p"); return p.or(this.empty);},
        rep1  : PS._rep(function(s){nc(s,"s");return $.extend(s,{type:"fail"});}),
        rep   : PS._rep(function(s){nc(s,"s");return $.extend(s,{type:"success", result:[]});}),
        rep0  : function (p) {return PS._rep0(p);},
        sep1  : function(p, s, ignoreSep) {
        	nc(p,"p");nc(s,"s");
            return (p) .and (this.rep0(
                    (s) .and (p) .ret(function(r1, r2) {
                        if(ignoreSep) return r2;
                        //console.log("sep: "+r1+" val:"+r2);
                        return {sep:r1, value:r2};
                    })
            )) .ret(function(r1, r2){
            	//console.log("sep1 Succ "+disp(r1));
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
            	/*if(!r2) r2=[];
                r2.unshift(r1);
                return r2;*/
            });
        },
        sep   : function(p, s, i){return this.opt(this.sep1(p,s,i)).ret(function (r) {
        	if (r.isEmpty) return [];
        	return r;
        });}
    });
    return $;
    /****************************************************************/
}