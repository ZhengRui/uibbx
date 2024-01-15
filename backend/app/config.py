from os import environ

from starlette.config import Config

config = Config(environ.get("DOTENV_PATH", ".env"))

DATABASE_URL = config("DATABASE_URL", cast=str)

SECRET_KEY = config("SECRET_KEY", cast=str)
ALGORITHM = config("ALGORITHM", cast=str)
ACCESS_TOKEN_EXPIRE_MINUTES = config("ACCESS_TOKEN_EXPIRE_MINUTES", cast=int, default=600)

MAILING_ENDPOINT = config("MAILING_ENDPOINT", cast=str)

SMS_ACCESSKEYID = config("SMS_ACCESSKEYID", cast=str)
SMS_ACCESSSECRET = config("SMS_ACCESSSECRET", cast=str)
SMS_SIGNAME = config("SMS_SIGNAME", cast=str)
SMS_TEMPLATECODE = config("SMS_TEMPLATECODE", cast=str)
SMS_REGIONID = config("SMS_REGIONID", cast=str)

COINS_REWARDED_BY_REFER = config("COINS_REWARDED_BY_REFER", cast=int, default=1)
MAX_REWARDED_REFERS_PER_DAY = config("MAX_REWARDED_REFERS_PER_DAY", cast=int, default=5)
COINS_PRICE_PER_BUNDLE = config("COINS_PRICE_PER_BUNDLE", cast=int, default=1)

SSO_WeChat_APPID = config("SSO_WeChat_APPID", cast=str)
SSO_WeChat_SECRET = config("SSO_WeChat_SECRET", cast=str)

PAY_WeChat_MCHID = config("PAY_WeChat_MCHID", cast=str)
PAY_WeChat_APICLIENT_KEY_PATH = config("PAY_WeChat_APICLIENT_KEY_PATH", cast=str)
PAY_WeChat_CERT_SERIAL_NO = config("PAY_WeChat_CERT_SERIAL_NO", cast=str)
PAY_WeChat_APIV3_KEY = config("PAY_WeChat_APIV3_KEY", cast=str)
PAY_WeChat_APPID = config("PAY_WeChat_APPID", cast=str)
PAY_WeChat_NOTIFY_URL = config("PAY_WeChat_NOTIFY_URL", cast=str)
PAY_WeChat_CERT_DIR = config("PAY_WeChat_CERT_DIR", cast=str)

PAY_AliPay_APPID = config("PAY_AliPay_APPID", cast=str)
PAY_AliPay_APP_PRIVATE_KEY_PATH = config("PAY_AliPay_APP_PRIVATE_KEY_PATH", cast=str)
PAY_AliPay_PUBLIC_KEY_PATH = config("PAY_AliPay_PUBLIC_KEY_PATH", cast=str)
PAY_AliPay_NOTIFY_URL = config("PAY_AliPay_NOTIFY_URL", cast=str)
PAY_AliPay_GATEWAY = config("PAY_AliPay_GATEWAY", cast=str)

ADMIN_UID = config("ADMIN_UID", cast=str)
ADMIN_SWITCH = config("ADMIN_SWITCH", cast=bool, default=False)
