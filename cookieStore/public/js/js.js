$( document ).ready(function () {
	$(".BasharDeleteDiscount").click(function (e) {
		var discountId = $(this).attr('id');
		var $tr = $(e.target).closest('tr');
		
		$.get("/discount/" + discountId, function (data) {
			$tr.fadeOut("slow");
			
		});
	});
});

$("input").hover(
    () => {
        var date = new Date();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
		var logInput = "Hover Then remove on Input => Hours: " + h + " Minutes: " + m + " Seconds: " + s;
		
		//$.ajax({
		//url : 'http://localhost:3000/discount?logInput='+logInput,
		//type:'GET'
		//})
		
	},
    () => {
        var date = new Date();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        console.log("Hover Then remove on =>", "Hours:", h, "Minutes:", m, "Seconds:", s);
	}
);

function toggleColor() {
	var bodyColor = $("body").css("background-color");
	var navBarColor = $(".navBar").css("background-color");
	var tableColor = $("table").css("color");
	
	if (bodyColor === "rgb(255, 234, 221)") {
		$("body").css({"background-color": "#212020", "color": "white"});
		$(".navBar").css({"background-color": "#666262", "color": "white"});
		$("table").css({"color": "white"});
		$(".nightDayMode").attr("data-mode", "night");
		} else {
		$("body").css({"background-color": "#FFEADD", "color": "black"});
		$(".navBar").css({"background-color": "#FF6666", "color": "black"});
		$("table").css({"color": "black"});
		$(".nightDayMode").attr("data-mode", "day");
	}
}
function initializeColorMode() {
	var storedMode = localStorage.getItem("colorMode");
	if (storedMode === "night") {
		toggleColor();
	}
}
$(".nightDayMode").click(function () {
	toggleColor();
	
	var currentMode = $(".nightDayMode").attr("data-mode");
	localStorage.setItem("colorMode", currentMode);
});


initializeColorMode();


