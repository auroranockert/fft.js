<%
def real(x, i, stride = nil)
	if stride
		"#{x}[2 * (#{stride}) * (#{i})]"
	else
		"#{x}[2 * (#{i})]"
	end
end

def imag(x, i, stride = nil)
	if stride
		"#{x}[2 * (#{stride}) * (#{i}) + 1]"
	else
		"#{x}[2 * (#{i}) + 1]"
	end
end
 %>

var FFT = function () {
	"use strict"; /* Notice that this semicolon actually is required, I may need this comment to remember that. */
	
	function factor(n) {
		var p = 4, v = Math.floor(Math.sqrt(n)), buffer = []
		
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
			
			buffer.push(p)
			buffer.push(n)
		}
		
		return buffer
	}
	
	function allocate(n, inverse) {
		var state = {
			n: n,
			inverse: inverse,
			
			factors: factor(n),
			twiddle: new Float64Array(2 * n)
		}
		
		var t = state.twiddle, pi2 = 2 * Math.PI
		
		for (var i = 0; i < n; i++) {
			if (inverse) {
				var phase =  pi2 * i / n
			} else {
				var phase = -pi2 * i / n
			}
			
			<%= real('t', 'i') %> = Math.cos(phase)
			<%= imag('t', 'i') %> = Math.sin(phase)
		}
		
		return state
	}
	
	var rsqrt2 = 1.0 / Math.sqrt(2)
	
	function butterfly2(output, outputOffset, fStride, state, m) {
		var t = state.twiddle
		
		for (var i = 0; i < m; i++) {
			var v1_r = <%= real('output', 'outputOffset + i') %> * rsqrt2
			var v1_i = <%= imag('output', 'outputOffset + i') %> * rsqrt2
			
			var v2_r = <%= real('output', 'outputOffset + i + m') %> * rsqrt2
			var v2_i = <%= imag('output', 'outputOffset + i + m') %> * rsqrt2
			
			var t_r = v2_r * <%= real('t', 'i', 'fStride') %> - v2_i * <%= imag('t', 'i', 'fStride') %>
			var t_i = v2_r * <%= imag('t', 'i', 'fStride') %> + v2_i * <%= real('t', 'i', 'fStride') %>
			
			<%= real('output', 'outputOffset + i') %> = v1_r + t_r
			<%= imag('output', 'outputOffset + i') %> = v1_i + t_i
			
			<%= real('output', 'outputOffset + i + m') %> = v1_r - t_r
			<%= imag('output', 'outputOffset + i + m') %> = v1_i - t_i
		}
	}
	
	var rsqrt3 = 1.0 / Math.sqrt(3)
	
	function butterfly3(output, outputOffset, fStride, state, m) {
		var t = state.twiddle
		var m1 = m, m2 = 2 * m
		var fStride1 = fStride, fStride2 = 2 * fStride
		
		var e1_i = <%= imag('t', 'm', 'fStride') %>
		
		for (var i = 0; i < m; i++) {
			var v1_r = <%= real('output', 'outputOffset + i') %>      * rsqrt3
			var v1_i = <%= imag('output', 'outputOffset + i') %>      * rsqrt3
			
			var v2_r = <%= real('output', 'outputOffset + i + m1') %> * rsqrt3
			var v2_i = <%= imag('output', 'outputOffset + i + m1') %> * rsqrt3
			
			var v3_r = <%= real('output', 'outputOffset + i + m2') %> * rsqrt3
			var v3_i = <%= imag('output', 'outputOffset + i + m2') %> * rsqrt3
			
			var t1_r = v2_r * <%= real('t', 'i', 'fStride1') %> - v2_i * <%= imag('t', 'i', 'fStride1') %>
			var t1_i = v2_r * <%= imag('t', 'i', 'fStride1') %> + v2_i * <%= real('t', 'i', 'fStride1') %>
			
			var t2_r = v3_r * <%= real('t', 'i', 'fStride2') %> - v3_i * <%= imag('t', 'i', 'fStride2') %>
			var t2_i = v3_r * <%= imag('t', 'i', 'fStride2') %> + v3_i * <%= real('t', 'i', 'fStride2') %>
			
			var t3_r = t1_r + t2_r
			var t3_i = t1_i + t2_i
			
			var t4_r = (t1_r - t2_r) * e1_i
			var t4_i = (t1_i - t2_i) * e1_i
			
			v2_r = v1_r - t3_r / 2.0
			v2_i = v1_i - t3_i / 2.0
			
			<%= real('output', 'outputOffset + i') %>      = v1_r + t3_r
			<%= imag('output', 'outputOffset + i') %>      = v1_i + t3_i
			
			<%= real('output', 'outputOffset + i + m1') %> = v2_r - t4_i
			<%= imag('output', 'outputOffset + i + m1') %> = v2_i + t4_r
			
			<%= real('output', 'outputOffset + i + m2') %> = v2_r + t4_i
			<%= imag('output', 'outputOffset + i + m2') %> = v2_i - t4_r
		}
	}
	
	var rsqrt4 = 0.5
	
	function butterfly4(output, outputOffset, fStride, state, m) {
		var t = state.twiddle
		var m1 = m, m2 = 2 * m, m3 = 3 * m
		var fStride1 = fStride, fStride2 = 2 * fStride, fStride3 = 3 * fStride
		
		for (var i = 0; i < m; i++) {
			var v1_r = <%= real('output', 'outputOffset + i') %>      * rsqrt4
			var v1_i = <%= imag('output', 'outputOffset + i') %>      * rsqrt4
			
			var v2_r = <%= real('output', 'outputOffset + i + m1') %> * rsqrt4
			var v2_i = <%= imag('output', 'outputOffset + i + m1') %> * rsqrt4
			
			var v3_r = <%= real('output', 'outputOffset + i + m2') %> * rsqrt4
			var v3_i = <%= imag('output', 'outputOffset + i + m2') %> * rsqrt4
			
			var v4_r = <%= real('output', 'outputOffset + i + m3') %> * rsqrt4
			var v4_i = <%= imag('output', 'outputOffset + i + m3') %> * rsqrt4
			
			var t1_r = v2_r * <%= real('t', 'i', 'fStride1') %> - v2_i * <%= imag('t', 'i', 'fStride1') %>
			var t1_i = v2_r * <%= imag('t', 'i', 'fStride1') %> + v2_i * <%= real('t', 'i', 'fStride1') %>
			
			var t2_r = v3_r * <%= real('t', 'i', 'fStride2') %> - v3_i * <%= imag('t', 'i', 'fStride2') %>
			var t2_i = v3_r * <%= imag('t', 'i', 'fStride2') %> + v3_i * <%= real('t', 'i', 'fStride2') %>
			
			var t3_r = v4_r * <%= real('t', 'i', 'fStride3') %> - v4_i * <%= imag('t', 'i', 'fStride3') %>
			var t3_i = v4_r * <%= imag('t', 'i', 'fStride3') %> + v4_i * <%= real('t', 'i', 'fStride3') %>
			
			var t4_r = v1_r - t2_r
			var t4_i = v1_i - t2_i
			
			var t5_r = t1_r + t3_r
			var t5_i = t1_i + t3_i
			
			var t6_r = t1_r - t3_r
			var t6_i = t1_i - t3_i
			
			v1_r += t2_r
			v1_i += t2_i
			
			<%= real('output', 'outputOffset + i') %>      = v1_r + t5_r
			<%= imag('output', 'outputOffset + i') %>      = v1_i + t5_i
			
			<%= real('output', 'outputOffset + i + m2') %> = v1_r - t5_r
			<%= imag('output', 'outputOffset + i + m2') %> = v1_i - t5_i
			
			if (state.inverse) {
				<%= real('output', 'outputOffset + i + m1') %> = t4_r - t6_i
				<%= imag('output', 'outputOffset + i + m1') %> = t4_i + t6_r
				
				<%= real('output', 'outputOffset + i + m3') %> = t4_r + t6_i
				<%= imag('output', 'outputOffset + i + m3') %> = t4_i - t6_r
			} else {
				<%= real('output', 'outputOffset + i + m1') %> = t4_r + t6_i
				<%= imag('output', 'outputOffset + i + m1') %> = t4_i - t6_r
				
				<%= real('output', 'outputOffset + i + m3') %> = t4_r - t6_i
				<%= imag('output', 'outputOffset + i + m3') %> = t4_i + t6_r
			}
		}
	}
	
	function butterfly(output, outputOffset, fStride, state, m, p) {
		var t = state.twiddle, n = state.n, scratch = new Float64Array(2 * p)
		
		var rsqrt = 1.0 / Math.sqrt(p)
		
		for (var u = 0; u < m; u++) {
			for (var q1 = 0, k = u; q1 < p; q1++, k += m) {
				<%= real('scratch', 'q1') %> = <%= real('output', 'outputOffset + k') %> * rsqrt
				<%= imag('scratch', 'q1') %> = <%= imag('output', 'outputOffset + k') %> * rsqrt
			}
			
			for (var q1 = 0, k = u; q1 < p; q1++, k += m) {
				var tOffset = 0
				
				<%= real('output', 'outputOffset + k') %> = <%= real('scratch', '0') %>
				<%= imag('output', 'outputOffset + k') %> = <%= imag('scratch', '0') %>
				
				for (var q = 1; q < p; q++) {
					tOffset = (tOffset + fStride * k) % n
					
					var t_r = <%= real('scratch', 'q') %> * <%= real('t', 'tOffset') %> - <%= imag('scratch', 'q') %> * <%= imag('t', 'tOffset') %>
					var t_i = <%= real('scratch', 'q') %> * <%= imag('t', 'tOffset') %> + <%= imag('scratch', 'q') %> * <%= real('t', 'tOffset') %>
					
					<%= real('output', 'outputOffset + k') %> += t_r
					<%= imag('output', 'outputOffset + k') %> += t_i
				}
			}
		}
	}
	
	function work(output, outputOffset, f, fOffset, fStride, inputStride, factors, state) {
		var p = factors.shift()
		var m = factors.shift()
		
		if (m == 1) {
			for (var i = 0; i < p * m; i++) {
				<%= real('output', 'outputOffset + i') %> = <%= real('f', 'fOffset + i * fStride * inputStride') %>
				<%= imag('output', 'outputOffset + i') %> = <%= imag('f', 'fOffset + i * fStride * inputStride') %>
			}
		} else {
			for (var i = 0; i < p; i++) {
				work(output, outputOffset + i * m, f, fOffset + i * fStride * inputStride, fStride * p, inputStride, factors.slice(), state)
			}
		}
		
		switch (p) {
			case 2: butterfly2(output, outputOffset, fStride, state, m); break
			case 3: butterfly3(output, outputOffset, fStride, state, m); break
			case 4: butterfly4(output, outputOffset, fStride, state, m); break
			default: butterfly(output, outputOffset, fStride, state, m, p); break
		}
	}
	
	var fft = function (n, inverse) {
		this.state = allocate(n, inverse)
	}
	
	fft.prototype.process = function(output, input, stride) {
		if (!stride) { stride = 1 }
		
		if (input == output) {
			var temp = new Float64Array(2 * this.state.n)
			
			work(temp, 0, input, 0, 1, stride, this.state.factors.slice(), this.state)
			
			output.set(temp)
		} else {
			work(output, 0, input, 0, 1, stride, this.state.factors.slice(), this.state)
		}
	}
	
	var FFT = {}
	
	FFT.fft = fft
	
	return FFT
}()
