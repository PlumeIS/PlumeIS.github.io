function OpenMune () {
	document.getElementById("QuitMune").style.visibility = "visible";
	document.getElementById("ClickMune").style.visibility = "visible";
	document.body.style.overflowY = "hidden";
}
function QuitMune () {
	document.getElementById("QuitMune").style.visibility = "hidden";
	document.getElementById("ClickMune").style.visibility = "hidden";
	document.body.style.overflowY = "auto";
}