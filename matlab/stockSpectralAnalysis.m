% Andrew Schneer
% FFT Matlab Code
% 06/11/2015

% Housekeeping.
close all;
clear all;
clc;

% Create dummy sinewave for
% testing the code.

	% % Create a sample waveform to test code with.
	% dum_a = 1;
	% % Phase offset of signal.
	% dum_b = 0; % radians.
	% % Signal frequency.
	% dum_F = 10; % Hz.
	% % Signal period.
	% dum_T = (1/dum_F); % sec.
	% % Sampling frequency.
	% dum_Fs = 1000; % Hz.
	% % Sampling period.
	% dum_Ts = (1/dum_Fs); % sec.
	% % Signal DC offset.
	% dum_k = 0;
	% % Signal interval times.
	% dum_t_start = 0; % sec.
	% dum_t_finish = 2; % sec.
	% dum_dt = (dum_t_finish-dum_t_start); % sec.
	% % Time scale.
	% dum_t = linspace(dum_t_start,dum_t_finish,(dum_Fs*dum_dt)); % sec.
	% % Signal.
	% dum_x = ((dum_a*sin((2.*pi.*dum_F.*dum_t)+dum_b))+dum_k);





% Obtain actual signal to perform
% spectral analysis on.

% Import signal data.
n = 2518; % data points.
x = transpose(csvread('../data/nasdaq/PG_20050613-20150611.csv',1,1,[1 1 2518 1]));

% Declare information about
% imported signal.

% Sampling frequency.
Fs = 1; % cycle per day.
% Sampling period.
Ts = (1/Fs); % days per cycle.
% Time scale.
t = linspace(0,(n-1),(Fs*n)); % days.
% Number of FFT points.
% Extra ones are zero padded
% onto signal.  This formula finds
% the next power of 2 that will
% be larger than length(x);
nfft = (2^(ceil(log10(length(x))/log10(2))));
% Frequency spectrum values.
f = ((Fs/nfft).*linspace(0,((nfft/2)-1),(nfft/2)));

% Perform actual spectral analysis
% on imported signal.

% Remove DC offset by subtracting
% the averages of discrete windows
% of data points (determined by bufferSize).
% This reduces the strangth of zero-frequency
% components in the signal to reduce the
% overpowering effect of a peak at 0 Hz
% on the FFT plots.
bufferSize = 20; % data points.
% Mark the array index of the end of the
% last window where the average value
% was subtracted from all the data points.
lastWindowEnd = 0; % array index.
% New array to store signal with
% DC offset removed.
x_mod = zeros(1,length(x));
% Check if signal array is
% smaller than buffer size.
if(length(x) < bufferSize)
	disp('Buffer larger than length');
	bufferSize = length(x);
else
	% Perform DC offset removal.
	for i = (bufferSize:length(x))
		% Check if loop gets to
		% end of array before
		% it completes another
		% buffer window.  This means
		% there is a remainder of
		% data points that is less
		% than the buffer size.
		% This is the last iteration
		% of the loop as well.
		if((i == (lastWindowEnd+bufferSize)) || (i == length(x)))
			x_mod((lastWindowEnd+1):i) = (x((lastWindowEnd+1):i) - mean(x((lastWindowEnd+1):i)));
			lastWindowEnd = i;
		end
	end
end

% UNFORTUNATELY, WINDOWING FUNCTIONS
% ARE NOT AVAILABLE FOR FREEMAT,
% SO I WILL HAVE TO MANUALLY WRITE ONE.

% Calculate Hann (Hanning) Window:
% Size of window.
N = length(x_mod);
% Window.
w = [];
% Calculate window.
for i = (0:(N-1))
	w(i+1) = (0.5*(1-cos((2*pi*i)/(N-1))));
end

% Apply windowing function.
x_mod = (x_mod.*w);

% Take FFT.  The result is
% a series of complex numbers.
	% REPLACE "dum_x" HERE WITH
	% ACTUAL SIGNAL THAT SPECTRAL
	% ANALYSIS IS BEING DONE ON.
dft = fft(x_mod,nfft);
% Take first half of FFT output.
dft = dft(1:(nfft/2));
% Magnitude of FFT output.
% This converts the complex
% numbers into real number
% magnitude values.
mag_dft = abs(dft);
% Power of FFT output.
% Taking the magnitude of the complex
% FFT output and squaring it is the
% same as multiplying each complex element
% by its conjugate.  The only difference
% is that technically the conjugate method
% produces a complex number with zero
% imaginary component while the magnitude/
% squaring method produces simply a real number.
pow_dft = (mag_dft.^2);
% Plot power on log scale.
pow_dft_log = (10.*log10(pow_dft));

% Plots.
figure(1);
% Signal.
subplot(2,2,1);
plot(t,x);
title('Original Signal');
xlabel('Time (days)');
ylabel('Value');
% Signal modified with
% DC offset removed.
subplot(2,2,3);
plot(t,x_mod);
title('Signal Sans Zero-Frequency');
xlabel('Time (days)');
ylabel('Value');
% FFT Amplitude.
subplot(2,2,2);
plot(f,mag_dft);
title('FFT Amplitude Plot');
xlabel('Frequency (cycles/day)');
ylabel('FFT Amplitude');
% PSD Power Spectral Density.
subplot(2,2,4);
plot(f,pow_dft_log);
title('FFT PSD Plot');
xlabel('Frequency (cycles/day)');
ylabel('PSD Spectral Power (dB)');