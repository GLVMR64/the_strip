from flask_restful import Resource, Api
from flask import Flask, request, jsonify, session, make_response, redirect, url_for
from models import db, User
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime, timedelta
from flask_cors import CORS
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
hash_str = hashlib.md5((timestamp + private_key + public_key).encode()).hexdigest()
migrate = Migrate(app, db)
secret_key = os.urandom(24)
db.init_app(app)
app.secret_key = secret_key


@app.route('/')
def hello():
    return "I love Marvel!"


class Comics(Resource):
    def get(self):
        from models import Comic

        comics = Comic.query.all()
        serialized_comics = [{
            'id': comic.id,
            'title': comic.title,
            'description': comic.description
        } for comic in comics]

        return serialized_comics, 200


api.add_resource(Comics, '/comics')



@api.route('/register')
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

        # Create a new User object and save it to the database
        user = User(name=name, email=email, password=password)

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

        return response, 201



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

    # Generate a random cookie value
    cookie_value = secrets.token_hex(16)

    # Update the user's cookie value and expiration time in the database
    user.user_cookie = cookie_value
    user.cookie_expiration = datetime.utcnow() + timedelta(hours=24)  # Set the expiration time
    db.session.commit()

    # Set a cookie in the response with an expiration time of 24 hours
    response = jsonify({'message': 'Login successful'})
    response.set_cookie('user_id', str(user.id), expires=datetime.utcnow() + timedelta(hours=24))
    response.set_cookie('cookie_value', cookie_value, expires=datetime.utcnow() + timedelta(hours=24))

    return response, 200






class Home(Resource):
    def get(self):
        # Check if the user is logged in
        if 'user_id' in session:
            return "Welcome to the home page"  # Update with your home page content
        else:
            return redirect(url_for('login'))


api.add_resource(Home, '/home')


# Set a cookie after successful login
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
        response.set_cookie('user_id', str(user.id))  # Set the user_id in the cookie

        return response, 200


api.add_resource(SetCookie, '/set-cookie')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
