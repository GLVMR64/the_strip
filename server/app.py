from flask import Flask, request, jsonify, session, make_response
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime, timedelta
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from models import db, User, Comic
from flask_session import Session
import hashlib
import secrets
import time
import os

public_key = '1f2440e3320ab3d9b466c2c1699cc76a'
private_key = 'c717b70ce1da6ea17908f2803eb728b3610d1af6'
url = 'https://gateway.marvel.com/v1/public/comics'

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

api = Api(app)
timestamp = str(time.time())
hash_str = hashlib.md5(
    (timestamp + private_key + public_key).encode()).hexdigest()
migrate = Migrate(app, db)
secret_key = os.urandom(24)
db.init_app(app)
app.secret_key = secret_key
app.config['SESSION_TYPE'] = 'filesystem'  # Use secure session type
Session(app)


@app.route('/')
def hello():
    return "I love Marvel!"


class Comics(Resource):
    def get(self):
        comics = Comic.query.all()
        serialized_comics = [{
            'id': comic.id,
            'title': comic.title,
            'description': comic.description,
            'image': comic.image_url
        } for comic in comics]
        return serialized_comics, 200


api.add_resource(Comics, '/comics')


class Registration(Resource):
    def post(self):
        data = request.get_json()

        # Extract user information from the request data
        name = data['name']
        email = data['email']
        password = data['password']

        # Validate the input data using the validation schema or any other validation method

        # Check if a user with the same email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return {'message': 'User with the same email already exists'}, 409

        # Hash the password
        password_hash = generate_password_hash(password, method='sha256')

        # Create a new User object and save it to the database
        user = User(name=name, email=email, password_hash=password_hash)

        # Generate a random cookie value
        cookie_value = secrets.token_hex(16)

        # Set the user's cookie value and expiration time
        user.user_cookie = cookie_value
        user.cookie_expiration = datetime.utcnow() + timedelta(hours=24)  # Set the expiration time

        db.session.add(user)
        db.session.commit()

        # Set a cookie in the response with an expiration time of 24 hours
        response = jsonify({'message': 'User registered successfully'})
        response.set_cookie('user_id', str(user.id), expires=datetime.utcnow() + timedelta(hours=24))
        response.set_cookie('cookie_value', cookie_value, expires=datetime.utcnow() + timedelta(hours=24))

        return {'message': 'User registered successfully'}, 201


api.add_resource(Registration, '/register')


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Extract user information from the request data
    email = data['email']
    password = data['password']

    # Validate the input data using the validation schema or any other validation method

    # Check if a user with the given email exists
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Invalid email or password'}), 400

    # Check if the password is correct
    if not user.check_password(password):
        return jsonify({'message': 'Invalid email or password'}), 400

    # Login successful, set session variable to indicate the user is logged in
    session['user_id'] = user.id

    # Set a cookie in the response with an expiration time of 24 hours
    response = jsonify({'message': 'Login successful'})

    return response, 200



class SetCookie(Resource):
    def post(self):
        data = request.get_json()

        # Extract user information from the request data
        email = data['email']
        password = data['password']

        # Validate the input data using the validation schema or any other validation method

        # Check if a user with the given email exists
        user = User.query.filter_by(email=email).first()
        if not user:
            return {'message': 'Invalid email or password'}, 400

        # Check if the password is correct
        if not user.check_password(password):
            return {'message': 'Invalid email or password'}, 400

        # Login successful, set session variable to indicate the user is logged in
        session['user_id'] = user.id

        # Set a cookie in the response
        response = make_response({'message': 'Login successful'})
        # Set the user_id in the cookie
        response.set_cookie('user_id', str(user.id))

        return response, 200


api.add_resource(SetCookie, '/set-cookie')


@app.route('/collection', methods=['GET', 'POST'])
def collection():
    if request.method == 'GET':
        # Check if the user is logged in
        if 'user_id' in session:
            # Retrieve the user's saved comics from the database
            user_id = session['user_id']
            user = User.query.get(user_id)
            saved_comics = user.comics

            # Serialize the saved comics data
            serialized_comics = [{
                'id': comic.id,
                'title': comic.title,
                'description': comic.description
            } for comic in saved_comics]

            # Return the serialized comics as a JSON response
            return jsonify(serialized_comics), 200
        else:
            # User is not logged in, return an error message or redirect to the login page
            return jsonify({'message': 'Unauthorized'}), 401

    if request.method == 'POST':
        # Check if the user is logged in
        if 'user_id' in session:
            # Get the user ID from the session
            user_id = session['user_id']

            # Get the comic ID from the request data
            data = request.get_json()
            comic_id = data.get('comic_id')

            # Retrieve the user and comic objects from the database
            user = User.query.get(user_id)
            comic = Comic.query.get(comic_id)

            if not comic:
                return jsonify({'message': 'Comic not found'}), 404

            # Check if the comic is already in the user's collection
            if comic in user.comics:
                return jsonify({'message': 'Comic already in collection'}), 400

            # Add the comic to the user's collection
            user.comics.append(comic)
            db.session.commit()

            return jsonify({'message': 'Comic added to collection'}), 201
        else:
            # User is not logged in, return an error message or redirect to the login page
            return jsonify({'message': 'Unauthorized'}), 401


@app.route('/comics/<comic_id>')
def get_comic_details(comic_id):
    # Retrieve the comic with the given comic_id from the database
    comic = Comic.query.get(comic_id)
    if not comic:
        return jsonify({'message': 'Comic not found'}), 404

    # Serialize the comic data
    serialized_comic = {
        'id': comic.id,
        'title': comic.title,
        'description': comic.description,
        'image_url': comic.image_url,
    }

    return jsonify(serialized_comic), 200


@app.route('/user', methods=['POST'])
def get_user_data():
    data = request.get_json()

    # Extract user information from the request data
    email = data.get('email')

    if email:
        user = User.query.filter_by(email=email).first()
        if user:
            # Serialize the user data if needed
            serialized_user = {
                "email": user.email,
                "name": user.name,
                # Add more fields as needed
            }
            return jsonify(serialized_user), 200
        else:
            return jsonify({"error": "User not found"}), 404
    else:
        return jsonify({"error": "Email parameter missing"}), 400


@app.route("/check-session-cookie", methods=["GET"])
def check_session_cookie():
    if "user_id" in session:
        user_id = session["user_id"]
        # Perform any additional logic or database queries here
        return jsonify({"message": "Session cookie exists", "user_id": user_id}), 200
    else:
        return jsonify({"message": "Session cookie does not exist"}), 200


if __name__ == "__main__":
    app.run(port=5555, debug=True)
