from dotenv import dotenv_values

config = dotenv_values(".env")

class Config:
    SECRET_KEY = config.get('SECRET_KEY', 'super-secret-key')
    JWT_SECRET_KEY = config.get('JWT_SECRET_KEY', 'jwt-secret-string')

    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    CORS_HEADERS = 'Content-Type'


    DATABASE_URL = config.get('DATABASE_URL')

    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PROPAGATE_EXCEPTIONS = True
