#!/bin/bash

echo "=== Nested Tags Tree Setup ==="
echo ""

# Navigate to backend
cd ~/nested-tags-tree/backend

# Activate virtual environment
source venv/bin/activate

# Test database connection and create tables
echo "Testing database connection and creating tables..."
python3 << 'EOF'
from database import engine
from models import Base

print("Connecting to Supabase PostgreSQL...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully!")

# Verify by listing tables
from sqlalchemy import inspect
inspector = inspect(engine)
tables = inspector.get_table_names()
print(f"📋 Tables in database: {tables}")
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "=== Starting Backend Server ==="
    uvicorn main:app --reload --port 8000
else
    echo "❌ Failed to connect to database. Check your .env file."
fi
