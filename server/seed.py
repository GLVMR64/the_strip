from app import app, db, public_key, timestamp, hash_str, url, private_key
from models import User, Comic, Review
from sqlalchemy import func
from datetime import datetime
import requests

def seed_user():
    user = User(name='John Doe', email='john@example.com')
    user.set_password('password')  # Set the password using the set_password() method
    db.session.add(user)
    db.session.commit()


def seed_comics(num_fetches):
    limit = 100  # Number of comics to retrieve per request
    total_comics = num_fetches * limit
    offset = 0  # Initial offset for pagination
    number = 0

    while number < total_comics:
        # Make API request to fetch comics data
        params = {
            'apikey': public_key,
            'ts': timestamp,
            'hash': hash_str,
            'limit': limit,
            'offset': offset,
            'orderBy': 'title',
        }
        response = requests.get(url, params=params)
        
        data = response.json()
        print(data)
        if 'data' not in data or 'results' not in data['data']:
            print('Error: Invalid response format.')
            return

        results = data['data']['results']
        for comic_data in results:
            title = comic_data.get('title')
            description = comic_data.get('description', '')
            thumbnail = comic_data.get('thumbnail', {})
            image_url = f"{thumbnail.get('path', '')}/portrait_uncanny.{thumbnail.get('extension', '')}"
            release_date = comic_data.get('dates', [{}])[0].get('date', '')[:10]  # Extract only the date part

            # Create the Comic object with the fetched information
            comic = Comic(
                title=title,
                comic_description=description,
                release_date=release_date,
                image_url=image_url
            )

            db.session.add(comic)
            number += 1

        db.session.commit()  # Commit the batch to the database
        offset += limit  # Increment offset for the next pagination

        print(db.session, number)
    db.session.commit()




def seed_reviews():
    # Check if the User and Comic tables exist in the database
    if not db.engine.dialect.has_table(db.engine, 'user') or not db.engine.dialect.has_table(db.engine, 'comic'):
        print('Error: User or Comic table does not exist. Please seed User and Comic data first.')
        return

    # Check if any reviews already exist in the database
    existing_reviews_count = db.session.query(func.count(Review.id)).scalar()
    if existing_reviews_count > 0:
        print('Reviews already exist in the database. Aborting review seeding.')
        return

    # Create review objects and add them to the session
    reviews = [
        Review(comment='Great comic!', user_id=1, comic_id=1),
        Review(comment='Awesome artwork!', user_id=2, comic_id=1),
        # Add more reviews as needed
    ]
    for review in reviews:
        db.session.add(review)
    db.session.commit()

    print('Review seeding completed.')
