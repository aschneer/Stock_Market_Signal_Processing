function loadData_yahooFinance_01()
{
	var symbol = inputParams[5].val.toUpperCase();
	var interval = "d"; // Daily.
	var from_year = inputParams[1].val.slice(0,4);
	var from_month = inputParams[1].val.slice(5,7);
	var from_day = inputParams[1].val.slice(9,11);
	var from_hour = inputParams[2].val.slice(0,2);
	var from_min = inputParams[2].val.slice(4,6);
	var to_year = inputParams[3].val.slice(0,4);
	var to_month = inputParams[3].val.slice(5,7);
	var to_day = inputParams[3].val.slice(9,11);
	var to_hour = inputParams[4].val.slice(0,2);
	var to_min = inputParams[4].val.slice(4,6);

//	UPDATE THIS LATER TO GET THE INTERVAL INPUT
//	INSTEAD OF DEFAULTING TO MINUTE.

	$.ajax({
		type: "GET",
		url: "http://ichart.yahoo.com/table.csv?s="+symbol+"&a="+(from_month-1)+"&b="+from_day+"&c="+from_year+"&d="+(to_month-1)+"&e="+to_day+"&f="+to_year+"&g="+interval+"&ignore=.csv",
		dataType: "text",
		crossDomain: true,
		dataType: "jsonp",
		success: function(returnData1){
//			$.csv.toArrays(returnData1, {}, function(err,returnData2){
//				data = returnData2;
//				console.log(data);
//			)};
		}
	});
}