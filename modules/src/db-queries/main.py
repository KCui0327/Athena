import functions_framework
import json
import os
from flask import jsonify, request
import sqlalchemy
from sqlalchemy import text
from google.cloud import secretmanager
import pg8000

# Cache connections and configuration
db_connection = None
connection_name = None
db_user = None
db_password = None
db_name = None
secret_client = None

def get_db_config():
    """Retrieve database configuration from Secret Manager."""
    global secret_client, connection_name, db_user, db_password, db_name
    
    if secret_client is None:
        secret_client = secretmanager.SecretManagerServiceClient()
    
    # Only fetch once per function instance
    if connection_name is None:
        # Get connection parameters from Secret Manager
        project_id = "genai-genesis-454423"
        
        # Get AlloyDB connection name
        name = f"projects/{project_id}/secrets/alloydb-connection-name/versions/latest"
        response = secret_client.access_secret_version(request={"name": name})
        connection_name = response.payload.data.decode("UTF-8")
        
        # Get database user
        name = f"projects/{project_id}/secrets/alloydb-user/versions/latest"
        response = secret_client.access_secret_version(request={"name": name})
        db_user = response.payload.data.decode("UTF-8")
        
        # Get database password
        name = f"projects/{project_id}/secrets/alloydb-password/versions/latest"
        response = secret_client.access_secret_version(request={"name": name})
        db_password = response.payload.data.decode("UTF-8")
        
        # Get database name
        name = f"projects/{project_id}/secrets/alloydb-name/versions/latest"
        response = secret_client.access_secret_version(request={"name": name})
        db_name = response.payload.data.decode("UTF-8")

def get_db_connection():
    """Create or return a database connection."""
    global db_connection
    
    # Get connection parameters
    get_db_config()
    
    # Create connection if it doesn't exist
    if db_connection is None:
        # Use the AlloyDB connector with SQLAlchemy
        db_connection = sqlalchemy.create_engine(
            sqlalchemy.engine.url.URL(
                drivername="postgresql+pg8000",
                username=db_user,
                password=db_password,
                database=db_name,
                query={
                    "unix_sock": f"/cloudsql/{connection_name}/.s.PGSQL.5432"
                }
            ),
            pool_size=5,
            max_overflow=2,
            pool_timeout=30,
            pool_recycle=1800
        )
    
    return db_connection

@functions_framework.http
def db_query(request):
    """Cloud Function to handle database queries.
    
    Routes:
    GET /query?sql=<SQL_QUERY> - Execute a read-only query
    POST /execute - Execute a write operation (with JSON body containing SQL)
    GET /tables - List all tables in the database
    GET /table/<table_name> - Get schema for a specific table
    """
    
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    
    # Set CORS headers for the main request
    headers = {'Access-Control-Allow-Origin': '*'}
    
    try:
        # Get database connection
        db = get_db_connection()
        
        # Route: List tables
        if request.path == '/tables':
            query = text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
            with db.connect() as conn:
                result = conn.execute(query)
                tables = [row[0] for row in result]
            return (jsonify({"tables": tables}), 200, headers)
        
        # Route: Table schema
        elif request.path.startswith('/table/'):
            table_name = request.path.split('/')[-1]
            query = text("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = :table_name
            """)
            with db.connect() as conn:
                result = conn.execute(query, {"table_name": table_name})
                columns = [{"name": row[0], "type": row[1]} for row in result]
            return (jsonify({"table": table_name, "columns": columns}), 200, headers)
        
        # Route: Execute read-only query
        elif request.method == 'GET' and 'sql' in request.args:
            sql = request.args.get('sql')
            
            # Safety check: only allow SELECT statements
            if not sql.strip().upper().startswith('SELECT'):
                return (jsonify({"error": "Only SELECT queries are allowed with GET"}), 400, headers)
            
            with db.connect() as conn:
                result = conn.execute(text(sql))
                rows = [dict(row._mapping) for row in result]
            return (jsonify({"results": rows}), 200, headers)
        
        # Route: Execute write operation
        elif request.method == 'POST' and request.path == '/execute':
            if not request.is_json:
                return (jsonify({"error": "Missing JSON in request"}), 400, headers)
                
            data = request.get_json()
            if 'sql' not in data:
                return (jsonify({"error": "Missing 'sql' in request body"}), 400, headers)
            
            sql = data['sql']
            params = data.get('params', {})
            
            # Execute the statement
            with db.connect() as conn:
                result = conn.execute(text(sql), params)
                
                # For INSERT/UPDATE/DELETE, return the row count
                if result.rowcount >= 0:
                    return (jsonify({"rowsAffected": result.rowcount}), 200, headers)
                # For other statements
                else:
                    return (jsonify({"message": "Statement executed successfully"}), 200, headers)
        
        # Unknown route
        else:
            return (jsonify({
                "error": "Invalid route or method",
                "usage": {
                    "GET /query?sql=<SQL_QUERY>": "Execute a read-only query",
                    "POST /execute": "Execute a write operation",
                    "GET /tables": "List all tables",
                    "GET /table/<table_name>": "Get table schema"
                }
            }), 400, headers)
            
    except Exception as e:
        return (jsonify({"error": str(e)}), 500, headers)
