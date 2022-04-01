var token = md5("PlumeIS"+window.location.href);
$.post("http://119.91.21.142:80/AddViews",{"url":window.location.href,"token":token});

window.onload = function views(){
	$.get("http://119.91.21.142/GetViews?url="+window.location.href,
	function(data){
		document.getElementById("views").innerHTML = "当前网站访问人数:" + JSON.parse(data).value;
	});
}