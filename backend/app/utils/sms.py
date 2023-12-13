import json

from aliyunsdkcore.auth.credentials import AccessKeyCredential
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import CommonRequest

from ..config import (
    SMS_ACCESSKEYID,
    SMS_ACCESSSECRET,
    SMS_REGIONID,
    SMS_SIGNAME,
    SMS_TEMPLATECODE,
)

credentials = AccessKeyCredential(SMS_ACCESSKEYID, SMS_ACCESSSECRET)
client = AcsClient(region_id=SMS_REGIONID, credential=credentials)


def send_sms(cellnum: str, code: str):
    request = CommonRequest()
    request.set_accept_format('json')
    request.set_domain('dysmsapi.aliyuncs.com')
    request.set_method('POST')
    request.set_protocol_type('https')  # https | http
    request.set_version('2017-05-25')
    request.set_action_name('SendSms')

    request.add_query_param('PhoneNumbers', cellnum)
    request.add_query_param('SignName', SMS_SIGNAME)
    request.add_query_param('TemplateCode', SMS_TEMPLATECODE)
    request.add_query_param('TemplateParam', f'{{\"code\":\"{code}\"}}')

    response = json.loads(client.do_action(request))

    return response
