from models import Comic, db
import hashlib
import time
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_migrate import Migrate
from sqlalchemy import func
import requests
from flask_cors import CORS

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
db.init_app(app)


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

if __name__ == '__main__':
    app.run(port=5555, debug=True)
