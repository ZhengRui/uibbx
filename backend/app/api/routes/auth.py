import random
import re
import shutil
import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import httpx
from databases import Database
from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import ExpiredSignatureError, JWTError, jwt
from passlib.context import CryptContext
from pydantic import EmailStr

from ...config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ALGORITHM,
    COINS_REWARDED_BY_REFER,
    MAILING_ENDPOINT,
    MAX_REWARDED_REFERS_PER_DAY,
    SECRET_KEY,
    SSO_WeChat_APPID,
    SSO_WeChat_SECRET,
)
from ...db.connect import get_db
from ...db.core import (
    create_refer,
    create_user,
    get_and_del_verification_code,
    get_bundle_by_id,
    get_refers_today,
    get_user_by_field,
    save_verification_code,
    update_user_field_by_uid,
)
from ...models import Refer, User, UserInDB
from ...utils.sms import send_sms

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
http_scheme = HTTPBearer()


auth_router = r = APIRouter()


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str):
    return pwd_context.hash(password)


def check_password_format(password: str):
    pattern = re.compile(r"^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*_=+-]).{8,12}$")

    ok = pattern.match(password)
    if not ok:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="密码格式错误")
    return True


def create_access_token(data: dict, expires_delta: timedelta = None, encrypt_key: str = SECRET_KEY):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encode_jwt = jwt.encode(to_encode, encrypt_key, algorithm=ALGORITHM)
    return encode_jwt


def verify_access_token(token: str, encrypt_key: str = SECRET_KEY):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无效token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    expired_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="token已过期",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, encrypt_key, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise expired_exception
    except JWTError:
        raise credentials_exception


async def authenticate_user_with_field_password(db: Database, field_name: str, field_value: str, password: str):
    user = await get_user_by_field(
        db, field_name=field_name, field_value=field_value, only_check_existence=True, with_password=True
    )

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户不存在或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


async def get_current_user(
    db: Database = Depends(get_db), credentials: HTTPAuthorizationCredentials = Depends(http_scheme)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        uid = payload.get("sub")
        if uid is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await get_user_by_field(db, field_name="uid", field_value=uid, only_check_existence=True)
    if not user:
        raise credentials_exception

    return user


async def get_current_enabled_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=409, detail="Inactive user")

    return current_user


async def get_current_active_user(current_user: User = Depends(get_current_enabled_user)):
    if not current_user.verified:
        raise HTTPException(status_code=409, detail="Nonverified user")

    return current_user


async def send_email(recipients: List[EmailStr], message_type: str, message_data: Optional[Dict[str, Any]] = {}):
    mail_token = create_access_token(data={"sub": "uibbx"})
    async with httpx.AsyncClient() as mail_client:
        r = await mail_client.post(
            MAILING_ENDPOINT,
            headers={"Authorization": f"Bearer {mail_token}"},
            json={"recipients": recipients, "message_type": message_type, "message_data": message_data},
            timeout=None,
        )

        if r.status_code != 200:
            print(r.text)


async def sign_up_new_user(
    db: Database,
    usertype: str,
    cellnum: str,
    email: str,
    wxid: str,
    username: str,
    nickname: str,
    password: str,
    avatar: str,
):
    err = False

    if usertype == "cellnum":
        user = await get_user_by_field(db, field_name="cellnum", field_value=cellnum, only_check_existence=True)
        if user:
            err = True
            err_msg = "手机号已注册"

    elif usertype == "wechat":
        user = await get_user_by_field(db, field_name="wxid", field_value=wxid, only_check_existence=True)
        if user:
            err = True
            err_msg = "微信号已注册"

    else:
        user = await get_user_by_field(db, field_name="email", field_value=email, only_check_existence=True)
        if user:
            err = True
            err_msg = "邮箱已注册"

    if err:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=err_msg,
            headers={"WWW-Authenticate": "Bearer"},
        )

    # all verifications happen before arriving here
    verified = True

    new_user = await create_user(
        db,
        UserInDB(
            cellnum=cellnum,
            email=email,
            wxid=wxid,
            username=username,
            nickname=nickname or None,
            hashed_password=get_password_hash(password) if password else "",
            disabled=False,
            verified=verified,
            avatar=avatar,
            created_at=datetime.now().replace(microsecond=0),
            username_confirmed=False,
        ),
    )

    return new_user


@r.get("/verification/email")
async def request_verification_email(
    email: str,
    expect_registered: Optional[bool] = None,
    expect_secondlife: Optional[bool] = False,
    db: Database = Depends(get_db),
):
    if expect_registered is not None:
        user = await get_user_by_field(db, field_name="email", field_value=email, only_check_existence=True)
        if user and not expect_registered:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="邮箱已注册",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user and expect_registered:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="邮箱未注册",
                headers={"WWW-Authenticate": "Bearer"},
            )

    code = f"{random.randint(1, 1e6):06d}"
    await send_email(
        recipients=[email],
        message_type="verification_code",
        message_data={
            # "username": "ToDo",
            "verify_code": code,
        },
    )

    codeId = uuid.uuid4().hex
    await save_verification_code(db, codeId, code, secondlife=expect_secondlife)

    access_token_expires = timedelta(minutes=3)
    verification_token = create_access_token(
        data={"codeId": codeId, "email": email},
        expires_delta=access_token_expires,
        encrypt_key=f"{SECRET_KEY}/VERIFICATION",
    )
    return JSONResponse(status_code=200, content={"token": verification_token})


@r.post("/verification/email")
async def verify_email(
    email: str = Form(...), code: str = Form(...), token: str = Form(...), db: Database = Depends(get_db)
):
    payload = verify_access_token(token, f"{SECRET_KEY}/VERIFICATION")
    code_record = await get_and_del_verification_code(db, payload["codeId"], code)
    code_gt = dict(code_record).get("code")

    if code != code_gt:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="验证码错误")

    if email != payload["email"]:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="验证码与邮箱不匹配")

    return {"verificationPassed": True}


async def rewared_referrer(refer_token: str, referent_uid: str, db: Database):
    payload = verify_access_token(refer_token, f"{SECRET_KEY}/REFER")
    referrer = await get_user_by_field(
        db, field_name="uid", field_value=payload["referrer_uid"], only_check_existence=True
    )
    if referrer:
        coins_gained = COINS_REWARDED_BY_REFER

        refers_today = await get_refers_today(db, referrer.uid, "registration")
        if len(refers_today) >= MAX_REWARDED_REFERS_PER_DAY:
            coins_gained = 0

        await create_refer(
            db,
            Refer(
                referrer_uid=referrer.uid,
                referent_uid=referent_uid,
                bundle_id=payload.get("bundle_id", None),
                refer_type="registration",
                referred_at=datetime.now().replace(microsecond=0),
                coins_gained=coins_gained,
            ),
        )

        if coins_gained > 0:
            await update_user_field_by_uid(db, referrer.uid, {"coins": referrer.coins + coins_gained})


@r.post("/signup/email")
async def signup_by_email(
    email: str = Form(...),
    password: str = Form(...),
    code: str = Form(...),
    token: str = Form(...),
    refer_token: str = Form(None),
    db: Database = Depends(get_db),
):
    await verify_email(email, code, token, db)
    check_password_format(password)

    user = await sign_up_new_user(
        db,
        usertype="email",
        cellnum="",
        email=email,
        wxid="",
        username="",
        nickname="",
        password=password,
        avatar="",
    )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.uid},
        expires_delta=access_token_expires,
    )

    if refer_token:
        try:
            await rewared_referrer(refer_token, user.uid, db)
        except Exception:
            pass

    return {"access_token": access_token, "token_type": "bearer"}


@r.post("/token/email")
async def signin_by_email(email: str = Form(...), password: str = Form(...), db: Database = Depends(get_db)):
    user = await authenticate_user_with_field_password(db, field_name="email", field_value=email, password=password)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.uid},
        expires_delta=access_token_expires,
    )

    return {"access_token": access_token, "token_type": "bearer"}


@r.get("/token/refer")
async def refer(referrer_uid: str, bundle_id: uuid.UUID = None, db: Database = Depends(get_db)):
    access_token = None

    referrer = await get_user_by_field(db, field_name="uid", field_value=referrer_uid)
    if referrer:
        if bundle_id:
            bundle = await get_bundle_by_id(db, bundle_id, only_check_existence=True)

            if not bundle:
                bundle_id = None

        access_token_expires = timedelta(days=15)
        access_token = create_access_token(
            data={"referrer_uid": referrer.uid, **({"bundle_id": str(bundle_id)} if bundle_id else {})},
            expires_delta=access_token_expires,
            encrypt_key=f"{SECRET_KEY}/REFER",
        )

    return {"access_token": access_token, "token_type": "bearer"}


@r.post("/reset/password/email")
async def reset_password_via_email(
    email: str = Form(...),
    password: str = Form(...),
    code: str = Form(...),
    token: str = Form(...),
    db: Database = Depends(get_db),
):
    await verify_email(email, code, token, db)
    check_password_format(password)

    user = await get_user_by_field(db, field_name="email", field_value=email, only_check_existence=True)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="邮箱未注册",
            headers={"WWW-Authenticate": "Bearer"},
        )

    await update_user_field_by_uid(db, user.uid, {"hashed_password": get_password_hash(password)})
    return JSONResponse(content={"message": "success"})


@r.get("/verification/cellnum")
async def request_verification_cellnum(
    cellnum: str,
    expect_registered: Optional[bool] = None,
    expect_secondlife: Optional[bool] = False,
    db: Database = Depends(get_db),
):
    if expect_registered is not None:
        user = await get_user_by_field(db, field_name="cellnum", field_value=cellnum, only_check_existence=True)
        if user and not expect_registered:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="手机号已注册",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user and expect_registered:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="手机号未注册",
                headers={"WWW-Authenticate": "Bearer"},
            )

    code = f"{random.randint(1, 1e6):06d}"
    response = send_sms(cellnum, code)
    if response["Message"] != "OK":
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=response["Message"],
            headers={"WWW-Authenticate": "Bearer"},
        )

    codeId = uuid.uuid4().hex
    await save_verification_code(db, codeId, code, secondlife=expect_secondlife)

    access_token_expires = timedelta(minutes=5)
    verification_token = create_access_token(
        data={"codeId": codeId, "cellnum": cellnum},
        expires_delta=access_token_expires,
        encrypt_key=f"{SECRET_KEY}/VERIFICATION",
    )

    return JSONResponse(status_code=200, content={"token": verification_token})


@r.post("/verification/cellnum")
async def verify_cellnum(
    cellnum: str = Form(...), code: str = Form(...), token: str = Form(...), db: Database = Depends(get_db)
):
    payload = verify_access_token(token, f"{SECRET_KEY}/VERIFICATION")
    code_record = await get_and_del_verification_code(db, payload["codeId"], code)
    code_gt = dict(code_record).get("code")

    if code != code_gt:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="验证码错误")

    if cellnum != payload["cellnum"]:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="验证码与手机号不匹配")

    return {"verificationPassed": True}


@r.post("/signup/cellnum")
async def signup_by_cellnum(
    cellnum: str = Form(...),
    password: str = Form(...),
    code: str = Form(...),
    token: str = Form(...),
    refer_token: str = Form(None),
    db: Database = Depends(get_db),
):
    await verify_cellnum(cellnum, code, token, db)
    check_password_format(password)

    user = await sign_up_new_user(
        db,
        usertype="cellnum",
        cellnum=cellnum,
        email="",
        wxid="",
        username="",
        nickname="",
        password=password,
        avatar="",
    )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.uid},
        expires_delta=access_token_expires,
    )

    if refer_token:
        try:
            await rewared_referrer(refer_token, user.uid, db)
        except Exception:
            pass

    return {"access_token": access_token, "token_type": "bearer"}


@r.post("/token/cellnum")
async def signin_by_cellnum(cellnum: str = Form(...), password: str = Form(...), db: Database = Depends(get_db)):
    user = await authenticate_user_with_field_password(db, field_name="cellnum", field_value=cellnum, password=password)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.uid},
        expires_delta=access_token_expires,
    )

    return {"access_token": access_token, "token_type": "bearer"}


@r.post("/reset/password/cellnum")
async def reset_password_via_cellnum(
    cellnum: str = Form(...),
    password: str = Form(...),
    code: str = Form(...),
    token: str = Form(...),
    db: Database = Depends(get_db),
):
    await verify_cellnum(cellnum, code, token, db)
    check_password_format(password)

    user = await get_user_by_field(db, field_name="cellnum", field_value=cellnum, only_check_existence=True)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="手机号未注册",
        )

    await update_user_field_by_uid(db, user.uid, {"hashed_password": get_password_hash(password)})
    return JSONResponse(content={"message": "success"})


@r.post("/reset/password")
async def reset_password_via_login(
    old_password: str = Form(...),
    new_password: str = Form(...),
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    current_user_with_password = await get_user_by_field(
        db, field_name="uid", field_value=current_user.uid, only_check_existence=True, with_password=True
    )

    if not verify_password(old_password, current_user_with_password.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="旧密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

    check_password_format(new_password)
    await update_user_field_by_uid(db, current_user.uid, {"hashed_password": get_password_hash(new_password)})
    return JSONResponse(content={"message": "success"})


@r.get("/whoami", response_model=User)
async def whoami(current_user: User = Depends(get_current_enabled_user)):
    return current_user


@r.put("/whoami")
async def update_user(
    avatar: UploadFile = None,
    nickname: str = Form(""),
    description: str = Form(""),
    username: str = Form(""),
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    user_with_username = await get_user_by_field(
        db, field_name="username", field_value=username, only_check_existence=True
    )

    if user_with_username and user_with_username.uid != current_user.uid:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="用户名已存在",
        )

    updates = {}

    if nickname != current_user.nickname:
        updates["nickname"] = nickname

    if description != current_user.description:
        updates["description"] = description

    if username != current_user.username:
        updates["username"] = username

        if not current_user.username_confirmed:
            updates["username_confirmed"] = True

    cache_avatar_fd = './static/cache/avatars'
    avatar_fd = './static/avatars'

    if avatar:
        content = await avatar.read()
        ext = avatar.filename.split('.')[-1]
        avatar_ = f'{current_user.uid}.{ext}'
        with open(f'{cache_avatar_fd}/{avatar_}', 'wb') as f:
            f.write(content)

        if avatar_ != current_user.avatar:
            updates["avatar"] = avatar_

    if updates:
        await update_user_field_by_uid(db, current_user.uid, updates)

    if avatar:
        shutil.move(f'{cache_avatar_fd}/{current_user.uid}.{ext}', f'{avatar_fd}/{current_user.uid}.{ext}')

    return await get_user_by_field(db, field_name="uid", field_value=current_user.uid)


@r.post("/token/wechat")
async def signin_wechat(code: str = Form(...), refer_token: str = Form(None), db: Database = Depends(get_db)):
    async with httpx.AsyncClient() as wechat_client:
        r = await wechat_client.get(
            url="https://api.weixin.qq.com/sns/oauth2/access_token",
            params={
                "appid": SSO_WeChat_APPID,
                "secret": SSO_WeChat_SECRET,
                "code": code,
                "grant_type": "authorization_code",
            },
        )

        data = r.json()
        wxid = data.get("unionid")
        if not wxid:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="微信登录失败",
            )

        user = await get_user_by_field(db, field_name="wxid", field_value=wxid, only_check_existence=True)
        if not user:
            access_token = data.get("access_token")
            openid = data.get("openid")

            async with httpx.AsyncClient() as wechat_client:
                r = await wechat_client.get(
                    url="https://api.weixin.qq.com/sns/userinfo",
                    params={"access_token": access_token, "openid": openid},
                )

                data = r.json()

                nickname = data["nickname"]
                avatar = data["headimgurl"]

                user = await sign_up_new_user(
                    db,
                    usertype="wechat",
                    cellnum="",
                    email="",
                    wxid=wxid,
                    username="",
                    nickname=nickname or None,
                    password=uuid.uuid4().hex,
                    avatar=avatar,
                )

            if refer_token:
                try:
                    await rewared_referrer(refer_token, user.uid, db)
                except Exception:
                    pass

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.uid},
            expires_delta=access_token_expires,
        )

    return {"access_token": access_token, "token_type": "bearer"}
