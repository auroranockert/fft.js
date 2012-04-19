IN := fft.js
NODE_FFT := node-fft.js
TARGETS := $(NODE_FFT)

all: $(TARGETS)

$(NODE_FFT): $(IN)
	cp $^ $@
	echo "module.exports=FFT;" >> $@

clean:
	rm -rf $(TARGETS)

.PHONY: all clean
