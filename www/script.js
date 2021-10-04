// Handle form submission
const form = document.getElementById('form');
const img  = document.getElementById('img');

form.addEventListener('submit', e => {
	e.preventDefault();

	let data = Object.fromEntries(new FormData(e.target));

	/*
	if (!data.seed)
		data.seed = Math.floor(Math.random() * 100000000);
	*/

	// Send XHR
	const ajax = new XMLHttpRequest();
	ajax.onload = imageReceived;
	ajax.open("GET", "generate?" + encodeObject(data), true);
	ajax.send();
});

function encodeObject(obj) {
	return Object.entries(obj).map(value => `${value[0]}=${value[1]}`).join('&');
}

function imageReceived() {
	document.getElementById("map").src = "data:image/png;base64, " + this.response;
}

function updateNumber(element) {
	element.nextElementSibling.value = element.value;
}