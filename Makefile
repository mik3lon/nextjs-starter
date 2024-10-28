# Makefile for Next.js Project

# Variables
DOCKER_COMPOSE_FILE := docker-compose.yml
NEXT_APP_DIR := .
PORT := 3000

# Helpers
help:
	@echo "Available commands:"
	@echo "  make start         - Start the Next.js development server"
	@echo "  make build         - Build the Next.js project for production"
	@echo "  make start-prod    - Start the Next.js server in production mode"
	@echo "  make lint          - Run lint checks"
	@echo "  make test          - Run tests"
	@echo "  make clean         - Remove 'node_modules' and '.next' directories"
	@echo "  make install       - Install dependencies"
	@echo "  make update        - Update dependencies"
	@echo "  make docker-up     - Start Docker containers using docker-compose"
	@echo "  make docker-down   - Stop Docker containers"
	@echo "  make docker-build  - Build and start Docker containers"
	@echo "  make docker-logs   - View logs of Docker containers"
	@echo "  make rebuild       - Clean, install dependencies, and build the project"

start:
	@echo "Starting Next.js development server..."
	npm run dev

build:
	@echo "Building the Next.js project for production..."
	npm run build

start-prod:
	@echo "Starting Next.js server in production mode..."
	npm run start

lint:
	@echo "Running lint..."
	npm run lint

test:
	@echo "Running tests..."
	npm test

clean:
	@echo "Removing 'node_modules' and '.next' directories..."
	rm -rf node_modules .next

install:
	@echo "Installing dependencies..."
	npm install

update:
	@echo "Updating dependencies..."
	npm update

# Docker-related commands
docker-up:
	@echo "Starting Docker containers..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

docker-down:
	@echo "Stopping Docker containers..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

docker-build:
	@echo "Building Docker containers..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) up --build -d

docker-logs:
	@echo "Viewing Docker container logs..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f

# Utility commands
rebuild: clean install build
	@echo "Cleaned, installed, and rebuilt the project."

.PHONY: help start build start-prod lint test clean install update docker-up docker-down docker-build docker-logs rebuild
