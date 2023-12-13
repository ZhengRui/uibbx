from starlette.config import Config

config = Config('.env')

SECRET_KEY = config('SECRET_KEY', cast=str)
ALGORITHM = config('ALGORITHM', cast=str)

MAIL_USERNAME = config('MAIL_USERNAME', cast=str)
MAIL_PASSWORD = config('MAIL_PASSWORD', cast=str)
MAIL_FROM = config('MAIL_FROM', cast=str)
MAIL_FROM_NAME = config('MAIL_FROM_NAME', cast=str)
MAIL_SERVER = config('MAIL_SERVER', cast=str)
MAIL_PORT = config('MAIL_PORT', cast=int)
MAIL_STARTTLS = config('MAIL_STARTTLS', cast=bool)
MAIL_SSL_TLS = config('MAIL_SSL_TLS', cast=bool)
USE_CREDENTIALS = config('USE_CREDENTIALS', cast=bool)
VALIDATE_CERTS = config('VALIDATE_CERTS', cast=bool)
