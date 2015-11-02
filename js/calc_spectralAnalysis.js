// Global Variables:

// Raw data from CSV.
var data = [];
// Dataset of interest.
var x = [];
// Dataset with DC offset removed.
var x_mod = [];
// (Once per day sampling frequency);
var Fs = (1.15740740741*math.pow(10,(-05))); // Hz.
var Ts = (1/Fs); // sec. per cycle.
// Length of x.
var n = 0;
// Total time span of x (sec);
var totTime = 0;
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

function spectralAnalysis()
{
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
	var temp = fft.spectrum;

	// The output of the "fft.spectrum"
	// function is a Float32Array type object.
	// It must be converted to a JS Array to
	// use array functions on it.
	for (var i = 0; i < temp.length; i++)
	{
		dft[i] = temp[i];
	}

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

	createGoogleCharts();
}