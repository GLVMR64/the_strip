import os

# Configuration settings
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///database.db'  # Modify the database URI as per your setup
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# Development configuration
class DevelopmentConfig(Config):
    DEBUG = True

# Production configuration
class ProductionConfig(Config):
    DEBUG = False

# Select the appropriate configuration based on the environment
def get_config():
    if os.environ.get('FLASK_ENV') == 'production':
        return ProductionConfig()
    else:
        return DevelopmentConfig()
