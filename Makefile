CURRENT_BRANCH = $(shell git rev-parse --abbrev-ref HEAD)

sign:
	@if [ $(CURRENT_BRANCH) = "master" ]; then\
        echo "Start signing extension...";\
		web-ext sign --artifacts-dir=./build/ -s=./src/ --api-key=${firefox_api_key} --api-secret=${firefox_api_secret};\
	else\
		echo "BUILD ERROR: Signing can only be done in branch 'master'. Please change to master branch to sign.";\
    fi

help:
	@echo "Usage: make [option] ..."
	@echo "Options:"
	@echo '	build api-key="" api-secret=""  Sign the extension, if the current branch is master.'
	@echo '	help                            Print this message and exit.'
