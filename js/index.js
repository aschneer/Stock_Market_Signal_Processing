// Global Variables.
var data = [];
var x = [];
var x_mod = [];
var Fs = 1; // cycle per day.
var Ts = (1/Fs); // days per cycle.
var n = 0;
var nfft = 0;
var t = [];
var f = [];
var bufferSize = 20;
var lastWindowEnd = -1;

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
	nfft = (2^(math.ceil(math.log10(x.length)/math.log10(2))));
	// Time array (Matlab linspace) for
	// x-axis of signal plot.
	t = linspace(0,(n-1),(Fs*n));
	// Frequency array for x-axis of
	// FFT plots.
	f = linspace(0,((nfft/2)-1),(nfft/2));
	for(var i = 0; i < f.length; i++)
	{
		f[i] = (f[i]*(Fs/nfft));
	}

	// Perform actual spectral analysis
	// on imported signal.

	// Remove DC offset by subtracting
	// the averages of discrete windows
	// of data points (determined by bufferSize).
	// This reduces the strangth of zero-frequency
	// components in the signal to reduce the
	// overpowering effect of a peak at 0 Hz
	// on the FFT plots.
	x_mod = x;
	// Check if signal array is
	// smaller than buffer size.
	if(x.length < bufferSize)
	{
		console.log("Buffer larger than length");
		bufferSize = x.length;
	}
	else
	{
		// Perform DC offset removal.
		for(var i = (bufferSize-1); i < x.length; i++)
		{
			// Check if loop gets to
			// end of array before
			// it completes another
			// buffer window.  This means
			// there is a remainder of
			// data points that is less
			// than the buffer size.
			// This is the last iteration
			// of the loop as well.
			if((i == (lastWindowEnd+bufferSize)) || (i == x.length))
			{
				// Extract values in window focusing on.
				var windowTemp = [];
				for(var j = (lastWindowEnd+1); j < (i+1); j++)
				{
					windowTemp[j-(lastWindowEnd+1)] = x[j];
				}
				// Use values in focus window to calculate
				// x_mod values (DC offset shift).
				for(var j = (lastWindowEnd+1); j < (i+1); j++)
				{
					x_mod[j] = (x[j] - math.mean(windowTemp));
					lastWindowEnd = i;
				}
			}
		}
	}

	// LEFT OFF HERE WITH FFT...

    //var fft = new FFT(2048, 44100);
    //fft.forward(signal);
    //var spectrum = fft.spectrum;
}

// Generate an array of numVals linearly spaced
// values from lowBound to upBound.
function linspace(lowBound,upBound,numVals)
{
	if(!validator.isInt(numVals,{min:2}))
	{
		return "ERROR: numVals must be integer.";
	}
	else
	{
		var array = [];
		var step = ((upBound-lowBound)/(numVals-1));
		for(var i = 0; i < numVals; i++)
		{
			array[i] = (lowBound + (i*step));
		}
		return array;
	}
}