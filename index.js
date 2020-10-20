const STATE = {
	choose_person: 1,
	choose_quote: 2
}
var current_state = STATE.choose_person;
var current_loaded_person = undefined;
var all_persons = [];

window.onload = function load() {
	if(localStorage.getItem("all_names") == null) localStorage.setItem("all_names", "");
	load_persons();
}

function add_button_clicked() {
	console.log("klick");
	if(current_state == STATE.choose_person)
		new_person(prompt("Please Enter the name of the Person you want to add."));
	else if(current_state == STATE.choose_quote)
		new_quote(prompt("Please Enter the Quote you want to add."));
}

function create_person_button(name) {
	var main_div = document.getElementById("main_div");
	var pers = document.createElement("span");
	pers.setAttribute("onclick", `load_persons_quotes(\"${name}\")`);
	pers.setAttribute("class", "person_button");
	pers.innerHTML = decodeURIComponent(name);
	main_div.appendChild(pers);
	all_persons.push({
		name: encodeURIComponent(name),
		quotes: ""
	});
	save_to_localstorage();
}

function create_quote_button(quote) {
	var main_div = document.getElementById("main_div");
	var pers = document.createElement("span");
	pers.setAttribute("class", "person_button");
	pers.innerHTML = decodeURIComponent(quote);
	main_div.appendChild(pers);	
}

function new_person(name) {
	if(name.trimLeft() == "") {
		alert("The name cant be an empty string!");
		return;
	}
	console.log(name);
	create_person_button(name);
}

function new_quote(quote) {
	console.log(quote);
	if(quote.trimLeft() == "") {
		alert("The Quote cant be an empty string!");
		return;
	}
	create_quote_button(quote);
	localStorage.setItem(current_loaded_person, localStorage.getItem(current_loaded_person) + "|" + encodeURIComponent(quote));
	console.log("[saved qoutes]:" + localStorage.getItem(current_loaded_person));
}

function show_return_button() {
	var main_div = document.getElementById("main_div");
	var dot = document.createElement("span");
	dot.setAttribute("id", "ret_dot");
	dot.setAttribute("onclick", "ret_button_clicked()");
	var hor = document.createElement("span");
	hor.setAttribute("id", "ret_hor");
	hor.setAttribute("onclick", "ret_button_clicked()");
	var vert1 = document.createElement("span");
	vert1.setAttribute("id", "ret_vert1");
	vert1.setAttribute("onclick", "ret_button_clicked()");
	var vert2 = document.createElement("span");
	vert2.setAttribute("id", "ret_vert2");
	vert2.setAttribute("onclick", "ret_button_clicked()");
	main_div.appendChild(dot);
	main_div.appendChild(hor);
	main_div.appendChild(vert1);
	main_div.appendChild(vert2);
}

function ret_button_clicked() {
	document.getElementById("main_div").innerHTML = "";
	load_persons();
}

function hide_return_button() {
	document.getElementById("main_div").innerHTML = "";	
}

function load_persons_quotes(name) {
	document.getElementById("main_div").innerHTML = "";
	current_state = STATE.choose_quote;
	current_loaded_person = name;
	if(localStorage.getItem(name) == null) localStorage.setItem(name, "");
	var quotes = decodeURIComponent(localStorage.getItem(name));
	console.log(quotes);
	var quotes_splited = quotes.split("|");
	all_persons[get_person_by_name(name)].quotes = quotes_splited;
	console.log("loading quotes from: " + name + ", quotes: " + quotes_splited);
	show_return_button();

	var main_div = document.getElementById("main_div");
	for(var i = 0; i < quotes_splited.length; i++) {
		var quote = document.createElement("span");
		quote.setAttribute("class", "person_button");
		quote.innerHTML = quotes_splited[i];
		main_div.appendChild(quote);
	}
}

function get_person_by_name(name) {
	for(var i = 0; i < all_persons.length; i ++) {
		if(name == all_persons[i].name) return i;
	}
}

function load_persons() {
	current_loaded_person = undefined;
	all_persons = [];
	console.log("all_names: "  + localStorage.getItem("all_names"));
	var all_names = localStorage.getItem("all_names").split("|");
	for(var i = 1; i < all_names.length; i ++) {
		console.log(all_names[i]);
		create_person_button(all_names[i]);
	}
}

function save_to_localstorage() {
	console.log("[save_to_localstorage] called");
	var all_names = "";
	for(var i = 0; i < all_persons.length; i++) {
		all_names += "|" + all_persons[i].name;
		console.log("saving: " + all_persons[i].name);
		//localStorage.setItem(all_persons[i].name, all_persons[i].quotes);	
	}
	localStorage.setItem("all_names", all_names);
}
