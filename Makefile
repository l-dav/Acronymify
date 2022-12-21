
BRANCH = "$(git rev-parse --abbrev-ref HEAD)"

builddd:
	echo "wesh"
	echo ${BRANCH}
	# @echo "Start signing extension..."
	# @web-ext sign --api-key=$(api-key) --api-secret=$(api-secret) --artifacts-dir=build/

help:
	@echo "Sign your Firefox extension"
	@echo "Usage:"
	@echo 'make build api-key="" api-secret=""'