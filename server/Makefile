.PHONY: all deploy install_dependencies help

all: ## Runs the server
	@bun main.ts

deploy:
	git push ooz

install_dependencies: ## Install dependencies
	bun install -d bun-types
	bun add @types/web -D

help: ## Show this help
	@grep -Eh '\s##\s' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'