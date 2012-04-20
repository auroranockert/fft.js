TARGETS := lib/fft.js lib/node-fft.js

all: $(TARGETS)
node: lib/node-fft.js

lib/fft.js: src/fft.erb.js
	erb $^ > $@

lib/node-fft.js: lib/fft.js
	cp $^ $@
	echo "module.exports=FFT;" >> $@

clean:
	rm -rf $(TARGETS)

.PHONY: all clean
