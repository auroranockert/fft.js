TARGETS := fft.js node-fft.js

all: $(TARGETS)
node: node-fft.js

fft.js: fft.erb.js
	erb $^ > $@

node-fft.js: fft.js
	cp $^ $@
	echo "module.exports=FFT;" >> $@

clean:
	rm -rf $(TARGETS)

.PHONY: all clean
