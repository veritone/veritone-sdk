help: ## Print the list of makefile targets
	@grep -hE '^[a-zA-Z0-9_\. -]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-45s\033[0m %s\n", $$1, $$2}'

test: ## Test all valid and invalid examples against their respective schemas
	./scripts/test-examples.sh v2 \
	&& ./scripts/test-examples.sh v1

# Note: this is old code that I haven't been able to get to run on my laptop, that may be
# because it no longer works or because I don't have the right yarn/nvm/node/whatever
# configuration. -kmurray June '25
build: ## Builds the validator in the dist/ directory
	yarn
	yarn test
	yarn build
	mkdir -p dist/schemas/vtn-standard
	cp schemas/*/*.json dist/schemas/vtn-standard
