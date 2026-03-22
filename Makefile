COMPOSE      = docker compose
COMPOSE_FILE = docker-compose.yml

-include .env
export $(shell sed 's/=.*//' .env 2>/dev/null)

.PHONY: start stop restart build logs logs-api logs-web status delete api-shell web-shell health help

start: ## Start the stack.
	$(COMPOSE) -f $(COMPOSE_FILE) -p $(PROJECT) up -d

stop: ## Stop the stack (volumes preserved).
	$(COMPOSE) -f $(COMPOSE_FILE) -p $(PROJECT) down

restart: ## Restart the stack.
	$(COMPOSE) -f $(COMPOSE_FILE) -p $(PROJECT) down
	$(COMPOSE) -f $(COMPOSE_FILE) -p $(PROJECT) up -d

build: ## Rebuild images and start the stack.
	$(COMPOSE) -f $(COMPOSE_FILE) -p $(PROJECT) up -d --build

logs: ## Follow logs for all services.
	$(COMPOSE) -f $(COMPOSE_FILE) -p $(PROJECT) logs -f

logs-api: ## Follow logs for the API service.
	$(COMPOSE) -f $(COMPOSE_FILE) -p $(PROJECT) logs -f api

logs-web: ## Follow logs for the web service.
	$(COMPOSE) -f $(COMPOSE_FILE) -p $(PROJECT) logs -f web

status: ## Show container status.
	$(COMPOSE) -f $(COMPOSE_FILE) -p $(PROJECT) ps

delete: ## Full reset — removes containers and volumes.
	$(COMPOSE) -f $(COMPOSE_FILE) -p $(PROJECT) down -v --remove-orphans

api-shell: ## Open a shell in the API container.
	$(COMPOSE) -f $(COMPOSE_FILE) -p $(PROJECT) exec api sh

web-shell: ## Open a shell in the web container.
	$(COMPOSE) -f $(COMPOSE_FILE) -p $(PROJECT) exec web sh

health: ## Check API health endpoint.
	@curl -sf http://localhost:$(API_PORT)/health && echo " → OK" || (echo "KO"; exit 1)

help: ## Show available commands.
	@awk 'BEGIN {FS = ":.*##"; printf "\nAvailable commands:\n"} /^[a-zA-Z_-]+:.*##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
