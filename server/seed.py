from app import app, db, public_key, timestamp, hash_str, url, private_key
from models import User, Comic, Review
from sqlalchemy import func
from datetime import datetime
import requests
from faker import Faker


def seed_user():
    fake = Faker()
    user = User(name=fake.name(), email=fake.email())
    # Set the password using the set_password() method
    user.set_password('password')
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
            release_date = comic_data.get('dates', [{}])[0].get('date', '')[
                :10]  # Extract only the date part

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


def seed_reviews(num_reviews):
    fake = Faker()
    users = User.query.all()
    comics = Comic.query.all()

    for _ in range(num_reviews):
        random_user = fake.random_element(users)
        random_comic = fake.random_element(comics)
        review_text = fake.paragraph()

        review = Review(user_id=random_user.id,
                        comic_id=random_comic.id, review_text=review_text)
        db.session.add(review)

    db.session.commit()


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_user()
        # seed_comics(num_fetches=50)
        # Adjust the number of reviews you want to generate
        seed_reviews(num_reviews=100)
