CURRENT_BRANCH = $(shell git rev-parse --abbrev-ref HEAD)
CHANNEL = "unlisted"

sign:
	@if [ $(CURRENT_BRANCH) = "master" ]; then\
        echo "Start signing extension...";\
		web-ext sign --artifacts-dir=./build/ -s=./src/ --channel=${CHANNEL} --api-key=${firefox_api_key} --api-secret=${firefox_api_secret};\
	else\
		echo "BUILD ERROR: Signing can only be done in branch 'master'. Please change to master branch to sign.";\
    fi

build::
	@echo "Generating .zip archive in ./src/ ..."
	@web-ext build --artifacts-dir=./build/ -s=./src/ --overwrite-dest

help:
	@echo "Usage: make [option] ..."
	@echo "Options:"
	@echo '	sign                            Sign the extension, if the current branch is master.'
	@echo '	help                            Print this message and exit.'
