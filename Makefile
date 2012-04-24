TARGETS := lib/complex.js lib/node.erb.js lib/node.js

all: $(TARGETS)
node: lib/node.js

lib/complex.js: src/complex.erb.js
	erb $^ > $@

lib/node.erb.js: src/node.erb.js
	erb $^ > $@

lib/node.js: lib/node.erb.js
	erb $^ > $@

clean:
	rm -rf $(TARGETS)

.PHONY: all clean
