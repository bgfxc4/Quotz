const STATE = {
	choose_person: 1,
	rem_person:2,
	choose_quote: 3,
	rem_quote: 4
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
		new_person(prompt("Please enter the name of the person you want to add."));
	else if(current_state == STATE.choose_quote)
		new_quote(prompt("Please enter the quote you want to add."));
}

function create_person_button(name) {
	var main_div = document.getElementById("main_div");
	var pers = document.createElement("span");
	pers.setAttribute("onclick", `person_button_clicked(\"${name}\")`);
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
	if(name == null) return;
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
		alert("The quote cant be an empty string!");
		return;
	}
	create_quote_button(quote);
	localStorage.setItem(current_loaded_person, localStorage.getItem(current_loaded_person) + "|" + encodeURIComponent(quote));
	console.log("[saved qoutes]:" + localStorage.getItem(current_loaded_person));
}

function show_return_button() {
	var return_div = document.getElementById("return_button");
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
	return_div.appendChild(dot);
	return_div.appendChild(hor);
	return_div.appendChild(vert1);
	return_div.appendChild(vert2);
}

function hide_return_button() {
	document.getElementById("return_button").innerHTML = "";	
}

function ret_button_clicked() {
	if(current_state == STATE.choose_quote) {
		document.getElementById("main_div").innerHTML = "";
		hide_return_button();
		current_state = STATE.choose_person;
		load_persons();
	} else if(current_state == STATE.rem_person) {
		current_state = STATE.choose_person;
		hide_return_button();	
		exit_rem_mode();		
	} else if(current_state == STATE.rem_quote) {
		current_state = STATE.choose_quote;
		exit_rem_mode();	
	}
}

function enter_rem_mode() {
	var all_buttons = document.getElementById("main_div").children;
	for(var i = 0; i < all_buttons.length; i++) {
		console.log("enter rem");
		all_buttons[i].classList.add("red_button");
	}
}

function exit_rem_mode() {
	var all_buttons = document.getElementById("main_div").children;
	for(var i = 0; i < all_buttons.length; i++) {
		console.log("exit rem");
		all_buttons[i].classList.remove("red_button");
	}
	
	if (current_state == STATE.rem_person) {
		current_state = STATE.choose_person;
		hide_return_button();
	} else if (current_state == STATE.rem_quote) {
		current_state = STATE.choose_quote;
	}

}

function rem_button_clicked() {
	if (current_state == STATE.choose_person) {
		current_state = STATE.rem_person;
		show_return_button();
		enter_rem_mode();
	} else if (current_state == STATE.choose_quote) {
		current_state = STATE.rem_quote;
		enter_rem_mode();
	}
}

function person_button_clicked(name) {
	if (current_state == STATE.rem_person) {
		remove_person(name);	
	} else if (current_state == STATE.choose_person) {
		load_persons_quotes(name);
	}
}

function quote_button_clicked(index) {
	if (current_state == STATE.rem_quote) {
		remove_quote(index);
	}
}

function load_persons_quotes(name) {
	document.getElementById("main_div").innerHTML = "";
	current_state = STATE.choose_quote;
	current_loaded_person = name;
	if(localStorage.getItem(name) == null) localStorage.setItem(name, "");
	var quotes_splited = localStorage.getItem(name).split("|");
	all_persons[get_person_index_by_name(name)].quotes = quotes_splited;
	console.log("loading quotes from: " + name + ", quotes: " + quotes_splited);
	show_return_button();

	var main_div = document.getElementById("main_div");
	for(var i = 0; i < quotes_splited.length; i++) {
		var quote = document.createElement("span");
		quote.setAttribute("class", "person_button");
		quote.setAttribute("onclick", `quote_button_clicked(${i})`)
		quote.innerHTML = decodeURIComponent(quotes_splited[i]);
		main_div.appendChild(quote);
	}
}

function remove_person(name) {	
	if(!confirm(`Are you sure that you want to delete ${name}?`)) return;
	for(var i = 0; i < all_persons.length; i ++) {
		if(name == all_persons[i].name) {
			all_persons.splice(i, 1);	
		}
	}
	save_to_localstorage();
	localStorage.removeItem(encodeURIComponent(name));
	document.getElementById("main_div").innerHTML = "";
	exit_rem_mode();
	load_persons();
}

function remove_quote(index) {
	if (!confirm(`Are you sure that you want to delete this quote from ${current_loaded_person}?`)) {
		return;
	}
	console.log(index);
	var pers_index = get_person_index_by_name(current_loaded_person);
	all_persons[pers_index].quotes.splice(index, 1);
	var tosave = "";
	for (var i = 0; i < all_persons[pers_index].quotes.length; i ++) {
		tosave += "|" + encodeURIComponent(all_persons[pers_index].quotes[i]);
	}
	localStorage.setItem(encodeURIComponent(current_loaded_person), tosave);
	document.getElementById("main_div").innerHTML = "";
	load_persons_quotes(current_loaded_person);
}

function get_person_index_by_name(name) {
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
