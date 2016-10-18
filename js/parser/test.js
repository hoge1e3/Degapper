sys.load("js/parser.js");
sys.load("js/IndentBuffer.js");
sys.load("js/disp.js");
TestLang=function () {
	var $={};
	var sp=Parser.StringParser;
	var p=sp.str("a").and(sp.str("b")).ret(function (a,b) {
		//console.log(disp([a,b]));
		return [a,b];
	});
	$.parse=function (s) {
		console.log(s);
		var r=p.parseStr(s, "ab");
		console.log(disp(r.result));
		return r;
	};
	$.extension="test";
	return $;
}();