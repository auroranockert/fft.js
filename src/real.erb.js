<%= $:.unshift('.'); require "#{File.dirname(__FILE__)}/../src/complex.rb"; File.read "#{File.dirname(__FILE__)}/../LICENSE" %>

if (!FFT) {
	var FFT = {}
}

void function (namespace) {
	"use strict"
	
	function forwardButterfly2(output, outputOffset, outputStride, input, inputOffset, inputStride, product, n, twiddle, fStride) {
		var m = n / 2, q = n / product, old = product / 2
		
		for (var i = 0; i < q; i++) {
			var a0 = old * i
			var a1 = a0 + m
			
			var s0 = input[inputOffset + inputStride * a0]
			var s1 = input[inputOffset + inputStride * a1]
			
			var r0 = s0 + s1
			var r1 = s0 - s1
			
			var a0 = product * i
			var a1 = a0 + product - 1
			
			output[outputOffset + outputStride * a0] = r0
			output[outputOffset + outputStride * a1] = r1
		}
		
		if (old == 1) { return }
		
		for (var i = 0; i < old / 2; i++) {
			<%= load('t1', 'twiddle', -1, 'i') %>
			
			for (var j = 0; j < q; j++) {
				var a0 = j * old + 2 * i - 1
				var a1 = a0 + m
				
				<%= load('s0', 'input', 'inputOffset', 'a0', 'inputStride') %>
				
				<%= load('s1', 'input', 'inputOffset', 'a1', 'inputStride') %>
				<%= cmul('v1', 's1', 't1') %>
				
				<%= cadd('r0', 's0', 'v1') %>
				<%= csub('r1', 's0', 'v1') %>; r1_i = -r1_i
				
				var a0 = j * product + 2 * i - 1
				var a1 = (j - 1) * product - 2 * i - 1
				
				<%= store('r0', 'output', 'outputOffset', 'a0', 'outputStride') %>
				<%= store('r1', 'output', 'outputOffset', 'a1', 'outputStride') %>
			}
		}
		
		if (old % 2 == 1) { return }
		
		for (var i = 0; i < q; i++) {
			var a0 = (i + 1) * old - 1
			var a1 = a0 + m
			
			var r0_r =  <%= real('input', 'inputOffset', 'a0', 'inputStride') %>
			var r1_i = -<%= real('input', 'inputOffset', 'a1', 'inputStride') %>
			
			var a0 = i * product + old - 1
			
			<%= store('r0', 'output', 'outputOffset', 'a0', 'outputStride') %>
		}
	}
	
	function forwardButterfly(output, outputOffset, outputStride, input, inputOffset, inputStride, product, n, twiddle, fStride, factor) {
		var m = n / 2, q = n / product, old = product / 2
		
		var theta = 2.0 * Math.PI / factor
		
		var theta_r =  Math.cos(theta)
		var theta_i = -Math.sin(theta)
		
		for (var i = 0; i < q; i++) {
			var d_r = 1.0
			var d_i = 0.0
			
			for (var j = 0; j <= Math.floor(factor / 2); j++) {
				var sum_r = 0.0
				var sum_i = 0.0
				
				var w_r = 1.0
				var w_i = 0.0
				
				if (j > 0) {
					<%= cmul('t0', 'd', 'theta') %>
					
					d_r = t0_r
					d_i = t0_i
				}
				
				for (var k = 0; k < factor; k++) {
					var z = <%= real('input', 'inputOffset', 'i * old + k * m', 'inputStride') %>
					
					if (k > 0) {
						<%= cmul('t0', 'd', 'w') %>
						
						d_r = t0_r
						d_i = t0_i
					}
					
					/* TODO: Use Kahan summation..? */
					s_r += w_r * z
					s_i += w_i * z
				}
				
				if (j == 0) {
					var a0 = product * i
					
					output[outputOffset + outputStride * a0] = sum_r
				} else if (j < factor / 2) {
					var a0 = product * i
					
					output[outputOffset + outputStride * a0] = sum_r
				} else if (j == factor / 2) {
					
				}
			}
	        for (e1 = 0; e1 <= factor - e1; e1++)
	          {
	            if (e1 == 0)
	              {
	                const size_t to0 = product * k1;
	                VECTOR(out,ostride,to0) = sum_real;
	              }
	            else if (e1 < factor - e1)
	              {
	                const size_t to0 = k1 * product + 2 * e1 * product_1 - 1;
	                VECTOR(out,ostride,to0) = sum_real;
	                VECTOR(out,ostride,to0 + 1) = sum_imag;
	              }
	            else if (e1 == factor - e1)
	              {
	                const size_t to0 = k1 * product + 2 * e1 * product_1 - 1;
	                VECTOR(out,ostride,to0) = sum_real;
	              }

	          }
			
		}
		
		if (old == 1) { return }
		
		for (var i = 0; i < old / 2; i++) {
			
		}
		
		if (old % 2 == 1) { return }
		
		var t_arg = Math.PI / factor
		
		var t_r =  cos(t_arg)
		var t_i = -sin(t_arg)
		
		for (var i = 0; i < q; i++) {
			
		}
	}

    if (product_1 == 1)
      return;

    for (k = 1; k < (product_1 + 1) / 2; k++)
      {
        for (k1 = 0; k1 < q; k1++)
          {

            ATOMIC dw_real = 1.0, dw_imag = 0.0;

            for (e1 = 0; e1 < factor; e1++)
              {
                ATOMIC sum_real = 0.0, sum_imag = 0.0;

                ATOMIC w_real = 1.0, w_imag = 0.0;

                if (e1 > 0)
                  {
                    const ATOMIC tmp_real = dw_real * cos_d_theta + dw_imag * sin_d_theta;
                    const ATOMIC tmp_imag = -dw_real * sin_d_theta + dw_imag * cos_d_theta;
                    dw_real = tmp_real;
                    dw_imag = tmp_imag;
                  }

                for (e2 = 0; e2 < factor; e2++)
                  {

                    int tskip = (product_1 + 1) / 2 - 1;
                    const size_t from0 = k1 * product_1 + 2 * k + e2 * m - 1;
                    ATOMIC tw_real, tw_imag;
                    ATOMIC z_real, z_imag;

                    if (e2 == 0)
                      {
                        tw_real = 1.0;
                        tw_imag = 0.0;
                      }
                    else
                      {
                        const size_t t_index = (k - 1) + (e2 - 1) * tskip;
                        tw_real = GSL_REAL(twiddle[t_index]);
                        tw_imag = -GSL_IMAG(twiddle[t_index]);
                      }

                    {
                      const ATOMIC f0_real = VECTOR(in,istride,from0);
                      const ATOMIC f0_imag = VECTOR(in,istride,from0 + 1);

                      z_real = tw_real * f0_real - tw_imag * f0_imag;
                      z_imag = tw_real * f0_imag + tw_imag * f0_real;
                    }

                    if (e2 > 0)
                      {
                        const ATOMIC tmp_real = dw_real * w_real - dw_imag * w_imag;
                        const ATOMIC tmp_imag = dw_real * w_imag + dw_imag * w_real;
                        w_real = tmp_real;
                        w_imag = tmp_imag;
                      }

                    sum_real += w_real * z_real - w_imag * z_imag;
                    sum_imag += w_real * z_imag + w_imag * z_real;
                  }

                if (e1 < factor - e1)
                  {
                    const size_t to0 = k1 * product - 1 + 2 * e1 * product_1 + 2 * k;
                    VECTOR(out,ostride,to0) = sum_real;
                    VECTOR(out,ostride,to0 + 1) = sum_imag;
                  }
                else
                  {
                    const size_t to0 = k1 * product - 1 + 2 * (factor - e1) * product_1 - 2 * k;
                    VECTOR(out,ostride,to0) = sum_real;
                    VECTOR(out,ostride,to0 + 1) = -sum_imag;
                  }

              }
          }
      }


    if (product_1 % 2 == 1)
      return;

    {
      double tw_arg = M_PI / ((double) factor);
      ATOMIC cos_tw_arg = cos (tw_arg);
      ATOMIC sin_tw_arg = -sin (tw_arg);

      for (k1 = 0; k1 < q; k1++)
        {
          ATOMIC dw_real = 1.0, dw_imag = 0.0;

          for (e1 = 0; e1 < factor; e1++)
            {
              ATOMIC z_real, z_imag;

              ATOMIC sum_real = 0.0;
              ATOMIC sum_imag = 0.0;

              ATOMIC w_real = 1.0, w_imag = 0.0;
              ATOMIC tw_real = 1.0, tw_imag = 0.0;

              if (e1 > 0)
                {
                  ATOMIC t_real = dw_real * cos_d_theta + dw_imag * sin_d_theta;
                  ATOMIC t_imag = -dw_real * sin_d_theta + dw_imag * cos_d_theta;
                  dw_real = t_real;
                  dw_imag = t_imag;
                }

              for (e2 = 0; e2 < factor; e2++)
                {

                  if (e2 > 0)
                    {
                      ATOMIC tmp_real = tw_real * cos_tw_arg - tw_imag * sin_tw_arg;
                      ATOMIC tmp_imag = tw_real * sin_tw_arg + tw_imag * cos_tw_arg;
                      tw_real = tmp_real;
                      tw_imag = tmp_imag;
                    }

                  if (e2 > 0)
                    {
                      ATOMIC tmp_real = dw_real * w_real - dw_imag * w_imag;
                      ATOMIC tmp_imag = dw_real * w_imag + dw_imag * w_real;
                      w_real = tmp_real;
                      w_imag = tmp_imag;
                    }


                  {
                    const size_t from0 = k1 * product_1 + 2 * k + e2 * m - 1;
                    const ATOMIC f0_real = VECTOR(in,istride,from0);
                    z_real = tw_real * f0_real;
                    z_imag = tw_imag * f0_real;
                  }

                  sum_real += w_real * z_real - w_imag * z_imag;
                  sum_imag += w_real * z_imag + w_imag * z_real;
                }

              if (e1 + 1 < factor - e1)
                {
                  const size_t to0 = k1 * product - 1 + 2 * e1 * product_1 + 2 * k;
                  VECTOR(out,ostride,to0) = sum_real;
                  VECTOR(out,ostride,to0 + 1) = sum_imag;
                }
              else if (e1 + 1 == factor - e1)
                {
                  const size_t to0 = k1 * product - 1 + 2 * e1 * product_1 + 2 * k;
                  VECTOR(out,ostride,to0) = sum_real;
                }
              else
                {
                  const size_t to0 = k1 * product - 1 + 2 * (factor - e1) * product_1 - 2 * k;
                  VECTOR(out,ostride,to0) = sum_real;
                  VECTOR(out,ostride,to0 + 1) = -sum_imag;
                }

            }
        }
    }
    return;
	
	function backwardButterfly2(output, outputOffset, outputStride, input, inputOffset, inputStride, product, n, twiddle, fStride) {
		var m = n / 2, q = n / product, old = product / 2
		
		for (var i = 0; i < q; i++) {
			var a0 = (2 * i) * q
			var a1 = (2 * i + 2) * q - 1
			
			var s0 = input[inputOffset + inputStride * a0]
			var s1 = input[inputOffset + inputStride * a1]
			
			var r0 = s0 + s1
			var r1 = s0 - s1
			
			var a0 = q * i
			var a1 = q * i + m
			
			output[outputOffset + outputStride * a0] = r0
			output[outputOffset + outputStride * a1] = r1
		}
		
		if (q == 1) { return }
		
		for (var i = 0; i < q / 2; i++) {
			<%= load('t1', 'twiddle', -1, 'i') %>
			
			for (var j = 0; j < old; j++) {
				var a0 = 2 * j * q + 2 * i - 1
				var a1 = 2 * (j + 1) * q - 2 * i - 1
				
				<%= load('s0', 'input', 'inputOffset', 'a0', 'inputStride') %>
				<%= load('s1', 'input', 'inputOffset', 'a1', 'inputStride') %>
				
				var r0_r = s0_r + s1_r
				var r0_i = s0_i - s1_i
				
				var v1_r = s0_r - s1_r
				var v1_i = s0_i + s1_i
				
				<%= cmul('r1', 'v1', 't1') %>
				
				var a0 = j * q + 2 * i - 1
				var a1 = a0 + m
				
				<%= store('r0', 'output', 'outputOffset', 'a0', 'outputStride') %>
				<%= store('r1', 'output', 'outputOffset', 'a1', 'outputStride') %>
			}
		}
		
		if (q % 2 == 1) { return }
		
		for (var i = 0; i < q; i++) {
			var a0 = 2 * (i + 1) * q - 1
			
			<%= load('r0', 'input', 'inputOffset', 'a0', 'inputStride') %>
			
			<%= real('input', 'inputOffset', 'a0', 'inputStride') %> =  2 * r0_r
			<%= imag('input', 'inputOffset', 'a1', 'inputStride') %> = -2 * r0_i
		}
	}
	
	function work(output, outputOffset, outputStride, f, fOffset, fStride, inputStride, factors, state) {
		var p = factors.shift()
		var m = factors.shift()
		
		if (m == 1) {
			for (var i = 0; i < p * m; i++) {
				<%= load('x0', 'f', 'fOffset', 'i', 'fStride * inputStride') %>
				<%= store('x0', 'output', 'outputOffset', 'i', 'outputStride') %>
			}
		} else {
			for (var i = 0; i < p; i++) {
				work(output, outputOffset + outputStride * i * m, outputStride, f, fOffset + i * fStride * inputStride, fStride * p, inputStride, factors.slice(), state)
			}
		}
		
		switch (p) {
			case 2: butterfly2(output, outputOffset, outputStride, fStride, state, m); break
			case 3: butterfly3(output, outputOffset, outputStride, fStride, state, m); break
			case 4: butterfly4(output, outputOffset, outputStride, fStride, state, m); break
			default: butterfly(output, outputOffset, outputStride, fStride, state, m, p); break
		}
	}
	
	var real = function (n, inverse) {
		var n = ~~n, inverse = !!inverse
		
		if (n < 1) {
			throw new RangeError("n is outside range, should be positive integer, was `" + n + "'")
		}
		
		var state = {
			n: n,
			inverse: inverse,
			
			factors: [],
			twiddle: [],
			scratch: new Float64Array(n)
		}
		
		var t = new Float64Array(n)
		
		var p = 4, v = Math.floor(Math.sqrt(n))
		
		while (n > 1) {
			while (n % p) {
				switch (p) {
					case 4: p = 2; break
					case 2: p = 3; break
					default: p += 2; break
				}
				
				if (p > v) {
					p = n
				}
			}
			
			n /= p
			
			state.factors.push(p)
		}
		
		var theta = 2 * Math.PI / n, product = 1, twiddle = new Float64Array(n)
			
		for (var i = 0, t = 0; i < state.factors.length; i++) {
			var phase = theta * i, factor = state.factors[i]
			
			var old = product, product = product * factor, q = n / product
			
			state.twiddle.push(new Float64Array(twiddle, t))
			
			if (inverse) {
				var counter = q, multiplier = old
			} else {
				var counter = old, multiplier = q
			}
			
			for (var j = 1; j < factor; j++) {
				var m = 0
					
				for (var k = 1; k < counter / 2; k++, t++) {
					m = (m + j * multiplier) % n
						
					var phase = theta * m
						
					<%= real('t', 'i') %> = Math.cos(phase)
					<%= imag('t', 'i') %> = Math.sin(phase)
				}
			}
		}
		
		this.state = state
	}
	
	real.prototype.process = function(output, outputStride, input, inputStride) {
		var outputStride = ~~outputStride, inputStride = ~~inputStride
		
		if (outputStride < 1) {
			throw new RangeError("outputStride is outside range, should be positive integer, was `" + outputStride + "'")
		}
		
		if (inputStride < 1) {
			throw new RangeError("inputStride is outside range, should be positive integer, was `" + inputStride + "'")
		}
		
		var product = 1, state = 0, inverse = this.state.inverse
		
		var n = this.state.n, factors = this.state.factors
		var twiddle = this.state.twiddle, scratch = this.state.scratch
		
		for (var i = 0; i < factors.length; i++) {
			var factor = factors[i], old = product, product = product * factor
			
			var q = n / product, fStride = Math.ceil(old / 2) - 1
			
			if (state == 0) {
				var inBuffer = input, inStride = inputStride
				
				if (this.state.factors.length % 2 == 0) {
					var outBuffer = scratch, outStride = 1, state = 1
				} else {
					var outBuffer = output, outStride = outputStride, state = 2
				}
			} else if (state == 1) {
				var inBuffer = scratch, inStride = 1, outBuffer = output, outStride = outputStride, state = 2
			} else if (state == 2) {
				var inBuffer = output, inStride = outputStride, outBuffer = scratch, outStride = 1, state = 1
			} else {
				throw new RangeError("state somehow is not in the range (0 .. 2)")
			}
			
			if (inverse) {
				switch (factor) {
				case 2: backwardButterfly2(outBuffer, 0, outStride, inBuffer, 0, inStride, product, n, twiddle[i], fStride); break
				case 3: backwardButterfly3(outBuffer, 0, outStride, inBuffer, 0, inStride, product, n, twiddle[i], fStride); break
				case 4: backwardButterfly3(outBuffer, 0, outStride, inBuffer, 0, inStride, product, n, twiddle[i], fStride); break
				case 5: backwardButterfly3(outBuffer, 0, outStride, inBuffer, 0, inStride, product, n, twiddle[i], fStride); break
				default: backwardButterfly(outBuffer, 0, outStride, inBuffer, 0, inStride, product, n, twiddle[i], fStride, factor); break
				}
			} else {
				switch (factor) {
				case 2: forwardButterfly2(outBuffer, 0, outStride, inBuffer, 0, inStride, product, n, twiddle[i], fStride); break
				case 3: forwardButterfly3(outBuffer, 0, outStride, inBuffer, 0, inStride, product, n, twiddle[i], fStride); break
				case 4: forwardButterfly3(outBuffer, 0, outStride, inBuffer, 0, inStride, product, n, twiddle[i], fStride); break
				case 5: forwardButterfly3(outBuffer, 0, outStride, inBuffer, 0, inStride, product, n, twiddle[i], fStride); break
				default: forwardButterfly(outBuffer, 0, outStride, inBuffer, 0, inStride, product, n, twiddle[i], fStride, factor); break
				}
			}
		}
	}
	
	namespace.real = real
}(FFT)
