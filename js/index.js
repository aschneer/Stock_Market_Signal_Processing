// Global Variables.
var data = [];
var dft_data = [];
var Fs = 1; // cycle per day.
var Ts = (1/Fs); // days per cycle.
var n = 0;
var nfft = 0;
var t = [];
var f = [];

// Constants.
var DATE_COL = 0;
var CLOSE_COL = 1;
var VOLUME_COL = 2;
var OPEN_COL = 3;
var HIGH_COL = 4;
var LOW_COL = 5;

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
	// Extract dataset that will be analyzed.
	dft_data = [];
	// Make sure to skip the text column heading.
	for(var i = 1; i < data.length; i++)
	{
		dft_data[i-1] = data[i][CLOSE_COL];
	}
	n = dft_data.length;
	nfft = (2^(math.ceil(math.log10(dft_data.length)/math.log10(2))));
	// Time array (Matlab linspace);
	console.log(linspace(1,10,100));
	t = [];
	// Frequency array.
	f = [];

    var fft = new FFT(2048, 44100);
    fft.forward(signal);
    var spectrum = fft.spectrum;
}

function linspace(lowBound,upBound,numVals)
{
	var array = [];
	var step = ((upBound-lowBound)/(numVals-1));
	for(var i = 0; i < numVals; i++)
	{
		array[i] = (lowBound + (i*step));
	}
	return array;
}