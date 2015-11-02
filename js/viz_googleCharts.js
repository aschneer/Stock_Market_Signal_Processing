function createGoogleCharts()
{
	// Create data table.
	var dataTable = new google.visualization.DataTable();
	dataTable.addColumn("number","Time (sec)");
	dataTable.addColumn("number","Price ($ USD)");
	// Transform data into Google data
	// table format.
	var tableTemp = [];

	// VALUES OF X ARE CHANGING BEFORE THIS POINT!!!!!!!!!!!!!!!!!!!!1

	console.log(x);

	for (var i = 0; i < n; i++)
	{
		tableTemp[i] = [t[i],x[i]];
	}
	// Create the Google data table.
	dataTable.addRows(tableTemp);
	// Set chart options.
	var options = {
		"title":"Stock price history of...",
		"width":1000,
		"height":700
	};
	// Instantiate and draw chart.
	var chart = new google.charts.Line(document.getElementById("chart-01"));
	chart.draw(dataTable,options);
}