fft.js
================================================================================

FFT in JavaScript, it works, I think. No promises, but I tested it against Wolfram Alpha once, and it was reasonably accurate.

There are optimized kernels for prime factors, 2, 3, 4, so if you want high performance, use lengths that are a factor of those.

Usage
---------------------------------------------------------------------------------

```javascript

/* Create a new FFT object */

var fft = new FFT(n, inverse)

fft.process(output, input) /* Output and input should be float arrays (of the right length) */

```

Credits
---------------------------------------------------------------------------------

I was too lazy to calculate the butterflies myself, so they are inspired by [kissfft](http://sourceforge.net/projects/kissfft/), which is a small library for doing discrete fourier transforms.


License
---------------------------------------------------------------------------------

Copyright (c) 2012, Jens Nockert <jens@ofmlabs.org>, Jussi Kalliokoski <jussi@ofmlabs.org>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met: 

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer. 
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
