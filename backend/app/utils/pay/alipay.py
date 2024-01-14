from alipay import AliPay
from alipay.utils import AliPayConfig

from ...config import (
    PAY_AliPay_APP_PRIVATE_KEY_PATH,
    PAY_AliPay_APPID,
    PAY_AliPay_NOTIFY_URL,
    PAY_AliPay_PUBLIC_KEY_PATH,
)

app_private_key_string = open(PAY_AliPay_APP_PRIVATE_KEY_PATH).read()
alipay_public_key_string = open(PAY_AliPay_PUBLIC_KEY_PATH).read()

alipay = AliPay(
    appid=PAY_AliPay_APPID,
    app_notify_url=PAY_AliPay_NOTIFY_URL,
    app_private_key_string=app_private_key_string,
    alipay_public_key_string=alipay_public_key_string,
    sign_type="RSA2",
    debug=False,
    verbose=False,
    config=AliPayConfig(timeout=120),
)
