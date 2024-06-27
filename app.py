from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import pyodbc

app = Flask(__name__)
CORS(app)

# Database configuration
server = "skillsync12345.database.windows.net"
database = "SkillSyn"
username = "skillsync"
password = "Sudais22!"
driver = "{ODBC Driver 17 for SQL Server}"

def get_db_connection():
    conn = pyodbc.connect(
        f"DRIVER={driver};SERVER={server};PORT=1433;DATABASE={database};UID={username};PWD={password}"
    )
    return conn

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        print(f"Received signup data: {data}")

        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not all([name, email, password]):
            print("Missing required fields.")
            return jsonify({"message": "Missing required fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

        if user:
            print("User already exists.")
            cursor.close()
            conn.close()
            return jsonify({"message": "User already exists"}), 400

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
                       (name, email, hashed_password))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        print(f"Error in signup: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        print(f"Received login data: {data}")

        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            print("Missing required fields.")
            return jsonify({"message": "Missing required fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT user_id, password FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        print(f"User found: {user}")  # Add this line for debugging
        cursor.close()
        conn.close()

        if user and check_password_hash(user[1], password):
            return jsonify({"message": "Login successful", "user_id": user[0]}), 200
        else:
            print("Invalid email or password.")
            return jsonify({"message": "Invalid email or password"}), 401
    except Exception as e:
        print(f"Error in login: {e}")
        return jsonify({"message": f"Internal Server Error: {str(e)}"}), 500

@app.route('/playlists/<int:user_id>', methods=['GET'])
def get_playlists(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM playlists WHERE user_id = ?", (user_id,))
        playlists = cursor.fetchall()
        cursor.close()
        conn.close()

        playlists_list = []
        for playlist in playlists:
            playlists_list.append({
                'id': playlist[0],
                'name': playlist[1]
            })

        return jsonify(playlists_list), 200
    except Exception as e:
        print(f"Error in get_playlists: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
