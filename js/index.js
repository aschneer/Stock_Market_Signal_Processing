// Global Variables:

// Array of all input parameters
// and their values.
var inputParams = [];

// Constants.

// Index numbers for column
// headings of stock data
// CSV tables that come in.
// These are specific to the
// dataset being imported.
var DATE_COL = 0;
var CLOSE_COL = 1;
var VOLUME_COL = 2;
var OPEN_COL = 3;
var HIGH_COL = 4;
var LOW_COL = 5;

$(document).ready(function(){
	init();
});

function init()
{
//	loadLastInputParams();
	updateInputParams();
	regInputEventListeners();
}

// Register event listeners for all
// input elements.
function regInputEventListeners()
{
	$("input").on("change",function()
	{
		updateInputParams();
	});
	$("button.submit").click(function(){
/*
		$.ajax({
			type: "POST",
			url: "./data/dataSearchHistory/" + Date.now() + ".json",
			dataType: "text",
			data: inputParams,
			success: function(){
				console.log("Wrote last search parameters to file.")
			}
		});
*/
		loadData_yahooFinance_01();
	});
}

// Function to update all values
// entered into input form elements.
function updateInputParams()
{
	inputParams = [];
	$("input").each(function(i){
		inputParams[i] = {
			html_id: "",
			input_type: "",
			input_name: "",
			val: ""
		};
		inputParams[i].html_id = $(this).attr("id");
		inputParams[i].input_type = $(this).attr("type");
		inputParams[i].input_name = $(this).attr("name");
		switch($(this).attr("type"))
		{
			case "date":
				inputParams[i].val = $(this).prop("value");
				break;
			case "time":
				inputParams[i].val = $(this).prop("value");
				break;
			case "checkbox":
				inputParams[i].val = $(this).prop("checked");
				break;
			case "radio":
				inputParams[i].val = $(this).prop("checked");
				break;
			case "text":
				inputParams[i].val = $(this).prop("value");
				break;
			default:
				console.log("Error: Don't know how to get value of type '" + $(this).attr("type") + "'.")
		}
	});

	console.log(inputParams);
}

/*
function loadLastInputParams()
{
	$.ajax({
		type: "GET",
		url: "./data/dataSearchHistory/??????????.json",
		dataType: "text",
		data: inputParams,
		success: function(){
			Console.log("Wrote last search parameters to file.")
		}
	});
}
*/