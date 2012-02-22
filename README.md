# fft.js

FFT in JavaScript, fastest out there.

## Usage

```javascript

/* As a class, with automatic buffer reuse */

var fft = new FFT([bufferSize=2048]);

fft.forward(inputBuffer);
fft.backward(inputBuffer);

/* Static functionality */

FFT.fft(input, scratchBuffer, factors, inverse);

/* Kernel support */

if (!FFT.pass[3]) {
	console.error('Sorry, kernel of three is not supported yet :(');
}

```

## License

Licensed under BSD license.
