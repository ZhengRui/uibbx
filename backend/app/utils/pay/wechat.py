import logging

from wechatpayv3 import WeChatPay, WeChatPayType

from ...config import (
    PAY_WeChat_APICLIENT_KEY_PATH,
    PAY_WeChat_APIV3_KEY,
    PAY_WeChat_APPID,
    PAY_WeChat_CERT_DIR,
    PAY_WeChat_CERT_SERIAL_NO,
    PAY_WeChat_MCHID,
    PAY_WeChat_NOTIFY_URL,
)

with open(PAY_WeChat_APICLIENT_KEY_PATH, "r") as f:
    PRIVATE_KEY = f.read()

wxpay = WeChatPay(
    wechatpay_type=WeChatPayType.NATIVE,
    mchid=PAY_WeChat_MCHID,
    private_key=PRIVATE_KEY,
    cert_serial_no=PAY_WeChat_CERT_SERIAL_NO,
    apiv3_key=PAY_WeChat_APIV3_KEY,
    appid=PAY_WeChat_APPID,
    notify_url=PAY_WeChat_NOTIFY_URL,
    cert_dir=PAY_WeChat_CERT_DIR,
    partner_mode=False,
    proxy=None,
)
