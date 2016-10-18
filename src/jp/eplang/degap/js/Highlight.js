$(function () {
	$(document).on("mouseover",".path",function () {
		var q=$(this).find(".pathsrc").text();
		var p=$(this).closest(".programlist");
		p.find(q).css("background","#88aadd");
		p.find(q).find("*").css("background","#88aadd");
	});
	var base="#ffdddd";
	$(document).on("mouseout",".path",function () {
		var q=$(this).find(".pathsrc").text();
		var p=$(this).closest(".programlist");
		p.find(q).css("background",base);
		p.find(q).find("*").css("background",base);
	});
	$(".path").each(function () {
		var q=$(this).find(".pathsrc").text();
		var p=$(this).closest(".programlist");
		p.find(q).css("background",base);
	});
	$(".togmbtn").click(function () {
	    var cl=$(this).closest(".clist");
	    if (cl.length==0) $(".minor").toggle();
	    else cl.find(".minor").toggle();
	});
});
