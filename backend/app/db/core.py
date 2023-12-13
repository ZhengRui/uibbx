import random
from datetime import datetime
from typing import Optional, Union

from asyncpg.exceptions import UniqueViolationError
from databases import Database
from fastapi import HTTPException, status
from sqlalchemy import delete, insert, select, update

from ..models import User, UserInDB
from .schemas import UsersTable, VerificationCodesTable


async def get_user_by_field(
    db: Database,
    field_name: str,
    field_value: Union[str, int],
    only_check_existence: Optional[bool] = False,
) -> Union[User, bool]:
    query = select([UsersTable]).where(getattr(UsersTable, field_name) == field_value)
    user = await db.fetch_one(query)

    if not user:
        if only_check_existence:
            return False

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with {field_name}={field_value} not found",
        )

    return User(**user)


async def create_user(db: Database, user: UserInDB) -> User:
    if user.uid is not None:
        exist = await get_user_by_field(db, "uid", user.uid, only_check_existence=True)
        if exist:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"User with uid={user.uid} already exists",
            )

    while True:
        rnd_uid = f"{random.randint(1, 1e9):09d}"
        exist = await get_user_by_field(db, "uid", rnd_uid, only_check_existence=True)
        if not exist:
            break

    user.uid = rnd_uid

    try:
        query = insert(UsersTable).values(**user.dict())
        await db.execute(query)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot create user: {e}",
        )

    return User(**user.dict())


async def save_verification_code(db: Database, codeId: str, code: str, secondlife: Optional[bool] = False):
    try:
        values = {
            "cid": codeId,
            "code": code,
            "life": 2 if secondlife else 1,
            "created_at": datetime.now().replace(microsecond=0),
        }

        query = insert(VerificationCodesTable).values(values)
        await db.execute(query)

    except UniqueViolationError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Failed to generate verification code, please regenerate again",
        )


async def get_and_del_verification_code(db: Database, codeId: str, code: Optional[str] = None):
    query = select([VerificationCodesTable]).where(VerificationCodesTable.cid == codeId)

    record = await db.fetch_one(query=query)

    if record is None:
        raise HTTPException(status.HTTP_409_CONFLICT, detail="Verification code already used, please regenerate again")

    if code is None or code == dict(record).get("code"):
        life = dict(record).get("life")

        if life > 1:
            query = update(VerificationCodesTable).where(VerificationCodesTable.cid == codeId).values(life=life - 1)
        else:
            query = delete(VerificationCodesTable).where(VerificationCodesTable.cid == codeId)

        await db.execute(query)

    return record
