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
    
# Add a liked song
@app.route('/like-song', methods=['POST'])
def like_song():
    try:
        data = request.json
        print(f"Received like song data: {data}")

        user_id = data.get('userId')
        track_id = data.get('trackId')

        if not all([user_id, track_id]):
            print("Missing required fields.")
            return jsonify({"message": "Missing required fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO dbo.liked_songs (user_id, song_id) VALUES (?, ?)", (user_id, track_id))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Song liked successfully"}), 200
    except Exception as e:
        print(f"Error in like_song: {e}")
        return jsonify({"message": "Internal Server Error"}), 500


@app.route('/liked-songs/<int:user_id>', methods=['GET'])
def get_liked_songs(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT song_id FROM dbo.liked_songs WHERE user_id = ?", (user_id,))
        liked_songs = cursor.fetchall()
        cursor.close()
        conn.close()

        liked_song_ids = [song[0] for song in liked_songs]
        return jsonify(liked_song_ids), 200
    except Exception as e:
        print(f"Error in get_liked_songs: {e}")
        return jsonify({"message": "Internal Server Error"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from werkzeug.security import generate_password_hash, check_password_hash
# import firebase_admin
# from firebase_admin import credentials, firestore
# import os

# app = Flask(__name__)
# CORS(app)

# # Initialize Firebase
# service_account_path = os.path.join(os.path.dirname(__file__), '../melodique/serviceAccountKey.json')
# cred = credentials.Certificate(service_account_path)
# firebase_admin.initialize_app(cred)
# db = firestore.client()

# # Function to test Firestore connection
# def test_firestore_connection():
#     try:
#         # Write a test document
#         test_ref = db.collection('test').document('connection_test')
#         test_ref.set({
#             'test_field': 'test_value'
#         })
        
#         # Read the test document
#         doc = test_ref.get()
#         if doc.exists:
#             print("Firestore connection successful!")
#             print(f"Document data: {doc.to_dict()}")
#         else:
#             print("Failed to read the test document from Firestore.")
#     except Exception as e:
#         print(f"Error testing Firestore connection: {e}")

# Call the test function
# test_firestore_connection()

# @app.route('/signup', methods=['POST'])
# def signup():
#     try:
#         data = request.json
#         print(f"Received signup data: {data}")

#         name = data.get('name')
#         email = data.get('email')
#         password = data.get('password')

#         if not all([name, email, password]):
#             print("Missing required fields.")
#             return jsonify({"message": "Missing required fields"}), 400

#         users_ref = db.collection('users')
#         user = users_ref.where('email', '==', email).get()

#         if user:
#             print("User already exists.")
#             return jsonify({"message": "User already exists"}), 400

#         hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
#         users_ref.add({'name': name, 'email': email, 'password': hashed_password})

#         return jsonify({"message": "User created successfully"}), 201
#     except Exception as e:
#         print(f"Error in signup: {e}")
#         return jsonify({"message": "Internal Server Error"}), 500

# @app.route('/login', methods=['POST'])
# def login():
#     try:
#         data = request.json
#         print(f"Received login data: {data}")

#         email = data.get('email')
#         password = data.get('password')

#         if not all([email, password]):
#             print("Missing required fields.")
#             return jsonify({"message": "Missing required fields"}), 400

#         users_ref = db.collection('users')
#         user_docs = users_ref.where('email', '==', email).get()
#         if not user_docs:
#             print("Invalid email or password.")
#             return jsonify({"message": "Invalid email or password"}), 401

#         user = user_docs[0].to_dict()
#         if user and check_password_hash(user['password'], password):
#             return jsonify({"message": "Login successful", "user_id": user_docs[0].id}), 200
#         else:
#             print("Invalid email or password.")
#             return jsonify({"message": "Invalid email or password"}), 401
#     except Exception as e:
#         print(f"Error in login: {e}")
#         return jsonify({"message": f"Internal Server Error: {str(e)}"}), 500

# @app.route('/playlists/<string:user_id>', methods=['GET'])
# def get_playlists(user_id):
#     try:
#         playlists_ref = db.collection('playlists').where('user_id', '==', user_id)
#         playlists = playlists_ref.get()

#         playlists_list = []
#         for playlist in playlists:
#             playlists_list.append({
#                 'id': playlist.id,
#                 'name': playlist.to_dict().get('name')
#             })

#         return jsonify(playlists_list), 200
#     except Exception as e:
#         print(f"Error in get_playlists: {e}")
#         return jsonify({"message": "Internal Server Error"}), 500
    
# @app.route('/like-song', methods=['POST'])
# def like_song():
#     try:
#         data = request.json
#         print(f"Received like song data: {data}")

#         user_id = data.get('userId')
#         track_id = data.get('trackId')

#         if not all([user_id, track_id]):
#             print("Missing required fields.")
#             return jsonify({"message": "Missing required fields"}), 400

#         liked_songs_ref = db.collection('liked_songs')
#         liked_songs_ref.add({'user_id': user_id, 'track_id': track_id})

#         return jsonify({"message": "Song liked successfully"}), 200
#     except Exception as e:
#         print(f"Error in like_song: {e}")
#         return jsonify({"message": "Internal Server Error"}), 500

# @app.route('/liked-songs/<string:user_id>', methods=['GET'])
# def get_liked_songs(user_id):
#     try:
#         liked_songs_ref = db.collection('liked_songs').where('user_id', '==', user_id)
#         liked_songs = liked_songs_ref.get()

#         liked_song_ids = [song.to_dict().get('track_id') for song in liked_songs]
#         return jsonify(liked_song_ids), 200
#     except Exception as e:
#         print(f"Error in get_liked_songs: {e}")
#         return jsonify({"message": "Internal Server Error"}), 500

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)
