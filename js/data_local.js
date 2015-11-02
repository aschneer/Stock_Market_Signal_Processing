function loadData_local()
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

function processData_local()
{
	// Convert all data to number
	// data type.
	for(var i = 0; i < data.length; i++)
	{
		for(var j = 0; j < data[i].length; j++)
		{
			data[i][j] = Number(data[i][j]);
		}
	}

	// Extract dataset that will be analyzed.
	x = [];
	// Make sure to skip the text column heading.
	for(var i = 1; i < data.length; i++)
	{
		x[i-1] = data[i][CLOSE_COL];
	}
	n = x.length;
	nfft = math.pow(2,(math.ceil(math.log10(n)/math.log10(2))));
	totTime = (Ts*(n-1));
	// Time array (Matlab linspace) for
	// x-axis of signal plot.
	t = linspace(0,totTime,n);

	// Frequency array for x-axis of
	// FFT plots.
	f = linspace(0,((nfft/2)-1),(nfft/2));
	for(var i = 0; i < f.length; i++)
	{
		f[i] = (f[i]*(Fs/nfft));
	}

	spectralAnalysis();
}