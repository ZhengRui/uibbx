import random
from datetime import datetime
from typing import Optional, Union

from asyncpg.exceptions import UniqueViolationError
from databases import Database
from fastapi import HTTPException, status
from sqlalchemy import delete, insert, select, update

from ..models import BundleInDB, UserInDB
from .schemas import BundlesTable, LikesTable, UsersTable, VerificationCodesTable


async def get_user_by_field(
    db: Database,
    field_name: str,
    field_value: Union[str, int],
    only_check_existence: Optional[bool] = False,
) -> Union[UserInDB, bool]:
    query = select([UsersTable]).where(getattr(UsersTable, field_name) == field_value)
    user = await db.fetch_one(query)

    if not user:
        if only_check_existence:
            return False

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"用户: {field_name}={field_value} 不存在",
        )

    return UserInDB(**user)


async def create_user(db: Database, user: UserInDB) -> UserInDB:
    if user.uid is not None:
        exist = await get_user_by_field(db, "uid", user.uid, only_check_existence=True)
        if exist:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"用户: uid={user.uid} 已存在",
            )

    while True:
        rnd_uid = f"{random.randint(1, 1e9):09d}"
        exist = await get_user_by_field(db, "uid", rnd_uid, only_check_existence=True)
        if not exist:
            break

    user.uid = rnd_uid

    while True:
        rnd_username = f"user-{random.randint(1, 1e9):09d}"
        exist = await get_user_by_field(db, "username", rnd_username, only_check_existence=True)
        if not exist:
            break

    user.username = rnd_username

    try:
        query = insert(UsersTable).values(**user.dict())
        await db.execute(query)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"创建用户失败: {e}",
        )

    return user


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
            detail="验证码生成失败，请重新生成",
        )


async def get_and_del_verification_code(db: Database, codeId: str, code: Optional[str] = None):
    query = select([VerificationCodesTable]).where(VerificationCodesTable.cid == codeId)

    record = await db.fetch_one(query=query)

    if record is None:
        raise HTTPException(status.HTTP_409_CONFLICT, detail="验证码已使用，请重新生成")

    if code is None or code == dict(record).get("code"):
        life = dict(record).get("life")

        if life > 1:
            query = update(VerificationCodesTable).where(VerificationCodesTable.cid == codeId).values(life=life - 1)
        else:
            query = delete(VerificationCodesTable).where(VerificationCodesTable.cid == codeId)

        await db.execute(query)

    return record


async def update_user_field_by_uid(db: Database, uid: str, value: dict):
    query = update(UsersTable).where(UsersTable.uid == uid).values(value)
    await db.execute(query=query)


async def create_bundle(db: Database, bundle: BundleInDB) -> BundleInDB:
    query = insert(BundlesTable).values(**bundle.dict())
    await db.execute(query)
    return bundle


async def get_bundle_by_id(
    db: Database, id: str, only_check_existence: Optional[bool] = False
) -> Union[BundleInDB, bool]:
    query = select([BundlesTable]).where(BundlesTable.id == id)
    bundle = await db.fetch_one(query)

    if not bundle:
        if only_check_existence:
            return False

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"素材: id={id} 不存在",
        )

    # stupid encode/databses return a Record but not a Mapping
    # causing lots of stupid issues

    return BundleInDB(**dict(zip(bundle.keys(), bundle.values())))


async def like_bundle(db: Database, bundle_id: str, user_uid: str):
    query = select([LikesTable]).where(LikesTable.bundle_id == bundle_id).where(LikesTable.user_uid == user_uid)
    like = await db.fetch_one(query)
    if like:
        return

    try:
        query = insert(LikesTable).values(
            liked_at=datetime.now().replace(microsecond=0), bundle_id=bundle_id, user_uid=user_uid
        )
        await db.execute(query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"点赞失败: {e}",
        )


async def unlike_bundle(db: Database, bundle_id: str, user_uid: str):
    try:
        query = delete(LikesTable).where(LikesTable.bundle_id == bundle_id).where(LikesTable.user_uid == user_uid)
        await db.execute(query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"取消点赞失败: {e}",
        )


async def get_bundle_likes_count(db: Database, bundle_id: str):
    try:
        query = "SELECT COUNT(*) FROM likes WHERE bundle_id = :bundle_id"
        values = {"bundle_id": bundle_id}
        count = await db.execute(query=query, values=values)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"获取点赞数失败: {e}",
        )

    return count


async def get_bundle_liked_by_user(db: Database, bundle_id: str, user_uid: str):
    try:
        query = select([LikesTable]).where(LikesTable.bundle_id == bundle_id).where(LikesTable.user_uid == user_uid)
        liked = await db.fetch_one(query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"获取点赞状态失败: {e}",
        )

    return liked


async def get_bundles_liked_by_user(db: Database, user_uid: str, offset: int = 0, limit: int = 10):
    try:
        query = select([LikesTable]).where(LikesTable.user_uid == user_uid).offset(offset).limit(limit)
        liked = await db.fetch_all(query)

        query = select([BundlesTable]).where(BundlesTable.id.in_([like.bundle_id for like in liked]))
        bundles = await db.fetch_all(query)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"获取所有点赞素材失败: {e}",
        )

    return [BundleInDB(**dict(zip(bundle.keys(), bundle.values()))) for bundle in bundles]


async def get_bundles_published_by_user(db: Database, user_uid: str, offset: int = 0, limit: int = 10):
    try:
        query = select([BundlesTable]).where(BundlesTable.user_uid == user_uid).offset(offset).limit(limit)
        bundles = await db.fetch_all(query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"获取所有发布素材失败: {e}",
        )

    return [BundleInDB(**dict(zip(bundle.keys(), bundle.values()))) for bundle in bundles]
