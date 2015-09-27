###
# Build the distribution
###

SHELL = /bin/bash

NODE_MODULES ?= node_modules
NPM_BIN = $(shell npm bin)
DEBUG = 0
SOURCE_DIR ?= src
BUILD_CACHE_DIR ?= .cache
BUILD_DIR ?= dist
SASS_STYLE ?= compressed
SASS_SOURCEMAP ?= none

all: build

build: clean fonticons stylesheets javascripts

build.dev: set_dev build

start: build.dev watch

set_dev:
	@echo -e "\nDebug mode enabled\n"
	$(eval DEBUG = 1)
	$(eval SASS_STYLE = nested)
	$(eval SASS_SOURCEMAP = file)

# Clean
clean:
	@echo -e "\nClean build\n"
	@rm -rf $(BUILD_DIR)
	@rm -rf $(BUILD_CACHE_DIR)

# Copy files

# Fonticons
fonticons:
	@echo -e "\nProcessing font icons\n"
	@mkdir -p $(BUILD_CACHE_DIR)/fontello-css/
	@mkdir -p $(BUILD_DIR)/fonts/fontello/
	@$(NPM_BIN)/fontello-cli install \
		--css $(BUILD_CACHE_DIR)/fontello-css/ \
		--font $(BUILD_DIR)/fonts/fontello/ \
		--config $(SOURCE_DIR)/fontello/config.json
	@mkdir -p $(BUILD_CACHE_DIR)/scss/
	@for file in $(BUILD_CACHE_DIR)/fontello-css/*.css; do \
		mv $$file $(BUILD_CACHE_DIR)/scss/_$$(basename $$file .css).scss; \
	done

# Stylesheets
stylesheets:
	@echo -e "\nCompile stylesheets\n"
	@# Setting config
	@mkdir -p build-tools/
	@echo -e "\$$assets-build-dir: \"$$PWD/$(BUILD_DIR)\";" > \
		build-tools/generated-assets-build-dir.scss
	@# Cache required css ad scss
	@mkdir -p $(BUILD_CACHE_DIR)/scss
	@cp $(NODE_MODULES)/codemirror/lib/codemirror.css \
		$(BUILD_CACHE_DIR)/scss/_codemirror.scss
	@cp $(NODE_MODULES)/codemirror/theme/base16-light.css \
		$(BUILD_CACHE_DIR)/scss/_codemirror-theme.scss
	@sass --compass --scss \
		  --style $(SASS_STYLE) \
		  --sourcemap=$(SASS_SOURCEMAP) \
		  --load-path $(BUILD_CACHE_DIR)/scss \
		  --load-path $(NODE_MODULES) \
		  $(SOURCE_DIR)/scss/jquery-markdown-editor.scss $(BUILD_DIR)/jquery-markdown-editor.css

# Javascripts (jshint, browserify)
javascripts: javascripts.jshint javascripts.browserify


javascripts.jshint:
	@echo -e "\nRun jshint\n"
	@$(NPM_BIN)/jshint --reporter $(NODE_MODULES)/jshint-stylish-ex/stylish.js $(SOURCE_DIR)/js/

javascripts.browserify:
	@echo -e "\nCompiling javascripts\n"
	@if [[ $(DEBUG) == 1 ]]; then \
		$(NPM_BIN)/browserify -d $(SOURCE_DIR)/js/jquery-editor.js | \
			$(NPM_BIN)/exorcist $(BUILD_DIR)/jquery-editor.js.map > $(BUILD_DIR)/jquery-editor.js; \
	else \
		$(NPM_BIN)/browserify -g uglifyify $(SOURCE_DIR)/js/jquery-editor.js | \
			$(NPM_BIN)/uglifyjs -c > $(BUILD_DIR)/jquery-editor.js; \
	fi

# Watches
watch:
	@echo -e "Watching sources"
	@$(NPM_BIN)/shell-exec "make watch.fonticons" \
						   "make watch.stylesheets" \
						   "make watch.javascripts.jshint" \
						   "make watch.javascripts.watchify"

watch.fonticons:
	@$(NPM_BIN)/chokidar "$(SOURCE_DIR)/fontello/config.json" -c "make set_dev fonticons stylesheets" -d 3000

watch.stylesheets: set_dev
	@echo -e "\$$assets-build-dir: \"$(BUILD_DIR)\";" > \
		build-tools/generated-assets-build-dir.scss;
	@mkdir -p $(BUILD_DIR)/css/
	@sass --compass --scss \
		  --sourcemap=$(SASS_SOURCEMAP) \
		  --style $(SASS_STYLE) \
		  --load-path $(BUILD_CACHE_DIR)/scss \
		  --load-path $(NODE_MODULES) \
		  --watch $(SOURCE_DIR)/scss/:./$(BUILD_DIR)/css/

watch.javascripts.jshint:
	@$(NPM_BIN)/chokidar "$(SOURCE_DIR)/js/**/*.js" -c "make set_dev javascripts.jshint" -d 2000

watch.javascripts.watchify: set_dev
	@$(NPM_BIN)/watchify -v -d $(SOURCE_DIR)/js/jquery-editor.js -o "$(NPM_BIN)/exorcist $(BUILD_DIR)/jquery-editor.js.map > $(BUILD_DIR)/jquery-editor.js"
