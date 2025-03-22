#!/bin/bash
# Install dependencies

python3 -m venv venv
if [ -f venv/bin/activate ]; then
    echo "Virtual environment created successfully"
else
    echo "Error creating virtual environment"
    exit 1
fi

source venv/bin/activate
pip3 install -r src/backend/requirements.txt
# Run your app
fastapi dev src/backend/main.py