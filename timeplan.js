//Test

var first_hour = 7;
var row_height = 5;
var number_of_headers = 1;
var days_arr = ["day_1", "day_2", "day_3", "day_4", "day_5", "day_6", "day_7"];
var edit_event_mode = false; // Set to true if editing events.
var selected_week = "W_45_2019" // FORMAT: W_WW_YYYY ex:  W_01_2019 
/*
var newJSON = `{
    "settings": {
        "day_names": ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "L\u00F8rdag", "S\u00F8ndag"],
		"time_label": "tid"
    },
    "W_45_2019": {
        "day_1": {"16e84eb4e550002":{"event_name" : "Matematikk", "event_color" : "bgblue", "event_start" : [11,0], "event_end" : [13, 30], "event_location" : "Rom_1"}}
            
        ,
        "day_2": {},
        "day_3": {},
        "day_4": {},
        "day_5": {"16e84eb4e550001":{"event_name" : "Norsk", "event_color" : "bgred", "event_start" : [8,15], "event_end" : [13, 30], "event_location" : "Rom_2"}},
        "day_6": {},
        "day_7": {}
    }
}`;
*/
var initJSON = `{
    "settings": {
        "day_names": ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "L\u00F8rdag", "S\u00F8ndag"],
		"time_label": "tid"
    },
    "W_45_2019": {
        "day_1": {},
        "day_2": {},
        "day_3": {},
        "day_4": {},
        "day_5": {},
        "day_6": {},
        "day_7": {}
    }
}`


// TODO:
/*
	- location / room in event	
	- info in event
	-
	// var parsedJSON = JSON.parse(newJSON);
*/

var myStorage = window.localStorage;
var parsedJSON;
try{
	parsedJSON = JSON.parse(myStorage.getItem("schedule"));
}
catch (err){
	console.log(err);
	console.log("WHADDAFUCK");
	parsedJSON = JSON.parse(initJSON);
}

if (parsedJSON === null){
	parsedJSON = JSON.parse(initJSON);
}

var day_names = parsedJSON["settings"]["day_names"];
var time_label = parsedJSON["settings"]["time_label"];
document.getElementById("time_label").innerHTML = time_label;


function setDayNames() {
    for (let d = 0; d < 7; d++) {
        document.getElementById("dayName_" + (d + 1)).innerHTML = day_names[d];
    }
}
setDayNames();

// Takes an integer input and converts to string and adds zero padding
function str_pad2(input_int){
	return input_int.toString().padStart(2, "0")
}

// Formats a an array of hour and minutes to format "HH:MM"
function format_time(time_arr){
	let hour = time_arr[0];
	let min = time_arr[1];
	return `${str_pad2(hour)}:${str_pad2(min)}`
}

/*
	Creates a div containing buttons for editing timetable events.
*/
function add_event_buttons(){
	let new_node = document.createElement("DIV");
	new_node.classList.add("event_buttons_container");
	let delete_btn = '<input type="button" class="event_button" value="&#128465" onclick="delete_event_btn(this)">';
	let other_btn = '<input type="button" class="event_button" value="y" onclick="delete_event_btn(this)">';	
	new_node.innerHTML = delete_btn + other_btn;
	return new_node;
}

// Creates a div formed like the example below:
// example <div class = "event bgblue" style ="top: 15%; height: 10%;">Subject 1<br>09:00 - 11:00</div>
function draw_timetable_events(event_week, event_id, event_name, event_day, event_start, event_end, event_location, color_class) {
    
	const hourMinToHour = (h,m)=>(h + (m / 60)); // converts from hours and minutes to hours,.
	const createSpan = (txt, s_class) => ('<span class = ' + s_class + '>' + txt + '</span>');

	let event_start_hours = hourMinToHour(event_start[0], event_start[1]);
	let event_end_hours = 	hourMinToHour(event_end[0], event_end[1]);
	let event_duration_hours = event_end_hours - event_start_hours;
	
	let new_node = document.createElement("DIV");
    new_node.classList.add(color_class);
    new_node.classList.add("event");
    new_node.style.top = (((event_start_hours
						+ number_of_headers)
						- first_hour) * row_height) + "%"
    // event box height: start of coordinate system is 1 * row_height. Each hour is row_height %
    new_node.style.height = event_duration_hours * row_height + "%"
	new_node.id = event_id;
	new_node.setAttribute("event_week", event_week);
    
	let event_start_formatted = format_time(event_start); // HH:MM
	let event_end_formatted = 	format_time(event_end);	 // HH:MM
	
	let event_name_HTML = createSpan(event_name, "event_name");
	let event_start_end_HTML = createSpan(event_start_formatted + "-" + event_end_formatted, "event_time");
	let event_location_HTML = createSpan(event_location, "event_location");
	
	// Add event_name, start and end times to the div new_node.	
	new_node.innerHTML = (event_name_HTML + "<br>"
						+ event_start_end_HTML + "<br>"						
						+ event_location_HTML);
	
	
	// Adds buttons.
	new_node.appendChild(add_event_buttons());

	// Appends the div containing the event to the div containing the specified day.
    document.getElementById(event_day).appendChild(new_node);
}



function buttonTest(el){
	console.log(el);
	console.log(el.parentNode.parentNode.id);
	let par_id = el.parentNode.parentNode.id;
	console.log(JSON.parse(par_id));
}

// TODO: Remove event from "database"
function delete_event_btn(evt){	
	btn_parent_node = evt.parentNode.parentNode; // the delete button is inside a child of the event. <div EVENT><div>BUTTON</div></div>
	
	// Deletes event from database
	let event_id = btn_parent_node.id;
	let event_day = btn_parent_node.parentNode.id;
	let event_week = btn_parent_node.getAttribute("event_week");
	delete parsedJSON[event_week][event_day][event_id];

	btn_parent_node.parentNode.removeChild(btn_parent_node);
}

function clear_element_by_class(class_name){	
	let elems = document.getElementsByClassName(class_name);	
	while (elems.length > 0){
		elems[0].parentNode.removeChild(elems[0]);
	}
	
}

function clear_all_events(){
	clear_element_by_class("event");
}


/*
	Creates an unique hexidecimal string value. 
	
	Done by concaternating millisecond timestamp in hex
	with a zero padded random number in hex between 0000 and FFFF.
*/
function get_unique_identifier(){
	const to_hex = n => n.toString(16);
	let time_stamp = Date.now();
	time_stamp = to_hex(time_stamp);
	let random_suffix = Math.floor(Math.random()*(0xFFFF+1));
	random_suffix = to_hex(random_suffix).padStart(4,"0");
	return time_stamp+random_suffix;
}
	


/*
	week_id: W_WW_YYYY (WW = week number).
*/
function read_events_week(week_id){
	var selected_week = parsedJSON[week_id];





	//console.log(selected_week);

	for (let day of days_arr) {
		//console.log(day);
		let current_day = selected_week[day];
		//console.log(current_day);
		
		for (let evt_id in current_day) {
			let evt = current_day[evt_id];
			draw_timetable_events(week_id,
								evt_id,
								evt["event_name"], 
								day, 
								evt["event_start"], 
								evt["event_end"],
								evt["event_location"], 
								evt["event_color"])
		}	
	}
}

function create_event(event_week_id, event_name, event_day, event_start, event_end, event_location, event_color){
	console.log(`${event_week_id}, ${event_name}, ${event_day}, ${event_start}, ${event_end}, ${event_location}, ${event_color}`);
	parsedJSON[event_week_id][event_day][get_unique_identifier()] = {"event_name": event_name, "event_start": event_start,"event_end": event_end, "event_location": event_location, "event_color": event_color};
	console.log(parsedJSON); //DEBUG
	console.log({"id":get_unique_identifier(), "day":event_day});	
	console.log({"event_name": event_name, "event_start": event_start,"event_end": event_end, "event_location": event_location, "event_color": event_color})
}


/*
	Reads user-input from the Add event menu. 
	Then saves the data in parsedJSON and draws the data in HTML. 
*/
function read_event_input(){

	// Time HH:MM to [H:int,M:int]
	const str_time_to_arr_time= s => (s.split(":").map(x=>parseInt(x,10)));
	let event_week_id = selected_week;
	let event_color = "bgblue"; // PLACEHOLDER
	let event_name = document.getElementById("menu_field_evt_name").value;
	let event_location = document.getElementById("menu_field_evt_location").value;
	let event_start = document.getElementById("menu_field_evt_start").value;
	let event_end = document.getElementById("menu_field_evt_end").value;
	event_start = str_time_to_arr_time(event_start);
	event_end = str_time_to_arr_time(event_end);
	let event_day = document.getElementById("menu_field_evt_day").value;
	//console.log(event_start);
	//alert(event_start);
	//DEBUG:
	//event_day = "day_3";


	console.log(`${event_week_id}, ${event_name}, ${event_day}, ${event_start}, ${event_end}, ${event_location}, ${event_color}`)
	create_event(event_week_id, event_name, event_day, event_start, event_end, event_location, event_color);
	console.log(parsedJSON); //DEBUG
	draw_update();
}

function save_events_to_local (){
	myStorage.setItem("schedule", JSON.stringify(parsedJSON));
}

/*
	week_id: W_WW_YYYY
*/
function delete_week(week_id){
	delete parsedJSON[week_id];
	console.log("week "+ week_id + "deleted");
}

function create_week(week_id){
	parsedJSON[week_id] = {
        "day_1": {},
        "day_2": {},
        "day_3": {},
        "day_4": {},
        "day_5": {},
        "day_6": {},
        "day_7": {}}
}

function draw_update(){
	clear_all_events();
	read_events_week(selected_week);
}

function test_data(){
	create_event(selected_week, "Test", "day_6",[10,25],[12,55], "rom_x", "bgblue");
	create_event(selected_week, "Test2", "day_2",[8,30],[19,01], "rom_y", "bgred");
}

function hide_menu(){
	document.getElementById("floating_menu").style.visibility="hidden";
}

function show_menu(){
	document.getElementById("floating_menu").style.visibility="visible";
}

function open_menu_btn(){
	show_menu();
	edit_event_mode = false;
}



read_events_week(selected_week);
//add_timetable_event("W_45_2019","1021201","Matematikk", "day_2", [9, 0], [10, 0], "Rom_3", "bgred");

/*Test2*/
//testset


/*
	TODO:
	- color selector for events
	- week selection
	- add date to days
	- information for user after saving
	- hover for buttons
	- button feedback.

	- verify input after clicking.
	- some kind of feedback when something about the input is wrong.

*/