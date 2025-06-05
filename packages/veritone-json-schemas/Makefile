help: ## Print the list of makefile targets
	@grep -hE '^[a-zA-Z0-9_\. -]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-45s\033[0m %s\n", $$1, $$2}'

test: ## Test all valid and invalid examples against their respective schemas
	./test-examples.sh
	