// Global Variables.

// Raw data from CSV.
var data = [];
// Dataset of interest.
var x = [];
// Dataset with DC offset removed.
var x_mod = [];
// (Once per day sampling frequency);
var Fs = (1.15740740741*(10^(-05))); // Hz.
var Ts = (1/Fs); // sec. per cycle.
// Length of x.
var n = 0;
// Length of data given
// to FFT (with zero padding).
var nfft = 0;
// Length of x_mod (probably
// has zero padding).
var N = 0;
// Window function array.
var w = [];
// Time axis values.
var t = [];
// Frequency axis values.
var f = [];
// Size of chunks for
// DC offset removal.
var bufferSize = 20;
// Array index of last element
// in last DC offset
// removal buffer.
var lastWindowEnd = -1;
// Result of FFT.
var dft = [];
// Magnitude of FFT result
// (complex number magnitudes).
var mag_dft = [];
// Power (PSD) of FFT result.
var pow_dft = [];
// Logarithmic PSD of FFT result.
var pow_dft_log = [];

// Constants.

// Index numbers for column
// headings of stock data
// CSV tables that come in.
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
		url: "./data/nasdaq/PG_20050613-20150611.csv",
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
	nfft = math.pow(2,(math.ceil(math.log10(n)/math.log10(2))));
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
	if(n < bufferSize)
	{
		console.log("ERROR: Buffer larger than length of dataset.");
		bufferSize = n;
	}
	else
	{
		// Perform DC offset removal.
		for(var i = (bufferSize-1); i < n; i++)
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
			if((i == (lastWindowEnd+bufferSize)) || (i == n))
			{
				// Extract values in window focusing on.
				var windowTemp = [];
				var windowTempMean = 0;
				windowTemp = x.slice((lastWindowEnd+1),(i+1));
				windowTempMean = math.mean(windowTemp);
				// Use values in focus window to calculate
				// x_mod values (DC offset shift).
				for(var j = (lastWindowEnd+1); j < (i+1); j++)
				{
					x_mod[j] = (x[j] - windowTempMean);
					lastWindowEnd = i;
				}
			}
		}
	}

	// Zero pad dataset for FFT.
	// Do this after removing DC
	// offset so zeros don't get
	// factored into the mean
	// calculations.
	if(nfft < n)
	{
		console.log("ERROR: nfft < n.");
	}
	else if(nfft > n)
	{
		// Add zero padding.
		for(var i = 0; i < (nfft-n); i++)
		{
			x_mod.push(0);
		}
	}
	else
	{
		// No problem, ready for FFT.
	}

	// Apply Hann (Hanning) window
	// function to dataset to smooth
	// out peaks on FFT spectrum.
	// Size of window.
	// (N should be larger than n
	// because n is likely zero padded).
	N = x_mod.length;
	// Window.
	w = [];
	for(var i = 0; i < N; i++)
	{
		// Calculate window.
		w[i] = (0.5*(1-math.cos((2*math.pi*i)/(N-1))));
		// Apply windowing function.
		x_mod[i] = (x_mod[i]*w[i]);
	}

	// Perform FFT.
	var fft = new FFT(nfft,Fs);
	fft.forward(x_mod);
	dft = fft.spectrum;

	// Take first half of FFT output.
	dft = dft.slice(0,(nfft/2));
	// Magnitude of FFT output.
	// This converts the complex
	// numbers into real number
	// magnitude values.
	// *** dsp.js library FFT function
	// *** might already eliminate the
	// *** complex numbers...
//	mag_dft = abs(dft);
	mag_dft = dft;
	// Power of FFT output.
	// Taking the magnitude of the complex
	// FFT output and squaring it is the
	// same as multiplying each complex element
	// by its conjugate.  The only difference
	// is that technically the conjugate method
	// produces a complex number with zero
	// imaginary component while the magnitude/
	// squaring method produces simply a real number.
	pow_dft = mag_dft;
	for(var i = 0; i < mag_dft.length; i++)
	{
		pow_dft[i] = math.pow(mag_dft[i],2);
	}
	// Plot power on log scale.
	pow_dft_log = pow_dft;
	for(var i = 0; i < pow_dft; i++)
	{
		pow_dft_log[i] = (10*math.log10(pow_dft[i]));
	}

	console.log(dft);
	console.log(mag_dft);
	console.log(pow_dft);
	console.log(pow_dft_log);
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