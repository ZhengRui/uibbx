from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr

from ..config import (
    ALGORITHM,
    MAIL_FROM,
    MAIL_FROM_NAME,
    MAIL_PASSWORD,
    MAIL_PORT,
    MAIL_SERVER,
    MAIL_SSL_TLS,
    MAIL_STARTTLS,
    MAIL_USERNAME,
    SECRET_KEY,
    USE_CREDENTIALS,
    VALIDATE_CERTS,
)

http_scheme = HTTPBearer()

# config mail
mail_conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_FROM,
    MAIL_PORT=MAIL_PORT,
    MAIL_SERVER=MAIL_SERVER,
    MAIL_FROM_NAME=MAIL_FROM_NAME,
    MAIL_STARTTLS=MAIL_STARTTLS,
    MAIL_SSL_TLS=MAIL_SSL_TLS,
    USE_CREDENTIALS=USE_CREDENTIALS,
    VALIDATE_CERTS=VALIDATE_CERTS,
    TEMPLATE_FOLDER=Path(__file__).parent.parent.parent / 'templates',
)

fm = FastMail(mail_conf)


async def mail_in_background(
    background_tasks: BackgroundTasks,
    recipients: List[EmailStr],
    subject: Optional[str] = '欢迎访问UIBBX',
    body: Optional[str] = '如果邮件误发， 请原谅.',
    message_type: Optional[str] = None,
    message_data: Optional[Dict[str, Any]] = {},
):
    subject_map = {
        'welcome': '欢迎访问UIBBX',
        'verification_code': 'UIBBX 验证码',
    }

    template_name = None
    if message_type.startswith('jinja_'):
        template_name = f"{message_type.replace('jinja_', '')}.j2"
        message = MessageSchema(
            recipients=recipients,
            subject=subject_map.get(template_name, subject),
            template_body=message_data,
            subtype='html',
        )

    else:
        if message_type == 'verification_code':
            verify_code = message_data.get('verify_code')
            body = f'<h4>请用如下验证码完成邮箱验证: <br /><br /><span>{verify_code}</span></h4>'

        message = MessageSchema(
            recipients=recipients, subject=subject_map.get(message_type, subject), body=body, subtype='html'
        )

    background_tasks.add_task(fm.send_message, message, template_name=template_name)

    return JSONResponse(status_code=200, content={"message": "email has been sent"})


app = FastAPI()


async def security_check(credentials: HTTPAuthorizationCredentials = Depends(http_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Unrecognized request sender',
        headers={'WWW-Authenticate': 'Bearer'},
    )

    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sender = payload.get('sub')

        if sender != 'uibbx':
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    return True


class MailModel(BaseModel):
    recipients: List[EmailStr]
    message_type: Optional[str] = None
    message_data: Optional[Dict[str, Any]] = {}


@app.post("/mail")
async def mail(background_tasks: BackgroundTasks, mail: MailModel, safe: bool = Depends(security_check)):
    return await mail_in_background(
        background_tasks, recipients=mail.recipients, message_type=mail.message_type, message_data=mail.message_data
    )
