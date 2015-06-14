// Global Variables.
data = [];

function init()
{
	$.ajax({
		type: "GET",
		url: "./data/nasdaq/PG_20140611-20150611.csv",
		dataType: "text",
		success: function(returnData1){
			$.csv.toArrays(returnData1, {}, function(err,returnData2){
				data = returnData2;
				processData();
			});
		}
	});
}

function processData()
{
	;
}