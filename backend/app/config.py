from os import environ

from starlette.config import Config

config = Config(environ.get("DOTENV_PATH", ".env"))

DATABASE_URL = config("DATABASE_URL", cast=str)

SECRET_KEY = config('SECRET_KEY', cast=str)
ALGORITHM = config('ALGORITHM', cast=str)

MAILING_ENDPOINT = config("MAILING_ENDPOINT", cast=str)

SMS_ACCESSKEYID = config("SMS_ACCESSKEYID", cast=str)
SMS_ACCESSSECRET = config("SMS_ACCESSSECRET", cast=str)
SMS_SIGNAME = config("SMS_SIGNAME", cast=str)
SMS_TEMPLATECODE = config("SMS_TEMPLATECODE", cast=str)
SMS_REGIONID = config("SMS_REGIONID", cast=str)
