from app import app, db
from models import User, Comic, Review
import requests

def seed_user():
    with app.app_context():
        users = [
            User(name='John Doe', email='john@example.com', password='password'),
            User(name='Jane Smith', email='jane@example.com', password='password'),
            # Add more users as needed
        ]
        for user in users:
            db.session.add(user)
        db.session.commit()

def seed_comics():
    with app.app_context():
        # Make API request to Marvel API
        url = 'https://gateway.marvel.com/v1/public/comics'
        params = {
            'apikey': '1f2440e3320ab3d9b466c2c1699cc76a',  
        }
        response = requests.get(url, params=params)
        data = response.json()

        # Process the response and store comics in the database
        results = data.get('data', {}).get('results', [])
        for comic_data in results:
            title = comic_data.get('title')
            description = comic_data.get('description', '')
            user_id = 1
            thumbnail = comic_data.get('thumbnail', {})
            image_url = f"{thumbnail.get('path', '')}/portrait_uncanny.{thumbnail.get('extension', '')}"
            comic = Comic(title=title, description=description, user_id=user_id, image_url=image_url)
            db.session.add(comic)

        db.session.commit()

def seed_reviews():
    with app.app_context():
        # Create review objects and add them to the session
        reviews = [
            Review(rating=4, comment='Great comic!', user_id=1, comic_id=1),
            Review(rating=5, comment='Awesome artwork!', user_id=2, comic_id=1),
            # Add more reviews as needed
        ]
        for review in reviews:
            db.session.add(review)
        db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_user()
        seed_comics()
        seed_reviews()
