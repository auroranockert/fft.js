fft.js
================================================================================

FFT in JavaScript, it works, I think.

No promises, but I tested it against Wolfram Alpha once, and it was reasonably accurate.

There are optimized kernels for prime factors, 2, 3, 4, so if you want high performance, use lengths that are a factor of those.

Notice that the DFT is not normalized, so `ifft(fft(x)) / n ~= x`


Usage
---------------------------------------------------------------------------------

```javascript

/* Create a new FFT object */

var fft = new FFT.complex(n, inverse)

/* Output and input should be float arrays (of the right length), type is either 'complex' (default) or 'real' */
fft.process(output, outputOffset, outputStride, input, inputOffset, inputStride, type)

/* Or the simplified interface, which just sets the offsets to 0, and the strides to 1 */
fft.simple(output, input, type)

```


Installing via npm
---------------------------------------------------------------------------------

You can also install via npm, the name is `fft` in the registy.


Credits
---------------------------------------------------------------------------------

I was too lazy to calculate the butterflies myself, so they are inspired by [kissfft](http://sourceforge.net/projects/kissfft/), which is a small library for doing discrete fourier transforms.

