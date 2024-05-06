.PHONY: help

help:
	@echo "Usage: make [command]"
	@echo "    Available commands:"
	@echo "    - help    Show this help message"
	@echo "    - venv    Activate Python virtual environment"
	@echo "    - install    Install Python dependencies"
	@echo "    - start:local    Run the functions locally (requires azure-functions-core-tools)"

venv:
	. ./venv/Scripts/activate

install:
	pip install -r requirements.txt

start:local:
	func start
