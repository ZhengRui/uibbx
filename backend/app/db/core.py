import random
import uuid
from datetime import datetime
from typing import Optional, Union

from asyncpg.exceptions import UniqueViolationError
from databases import Database
from fastapi import HTTPException, status
from sqlalchemy import delete, insert, select, update

from ..models import (
    Bundle,
    BundleInDB,
    Purchase,
    PurchaseOrder,
    Subscription,
    SubscriptionOrder,
    UserInDB,
)
from .schemas import (
    BookmarksTable,
    BundlesTable,
    LikesTable,
    PurchaseOrdersTable,
    PurchasesTable,
    SubscriptionOrdersTable,
    SubscriptionsTable,
    UsersTable,
    VerificationCodesTable,
)


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
    query = insert(BundlesTable).values(**bundle.dict(exclude={'creator_username', 'purchase_price'}))
    await db.execute(query)
    return bundle


async def get_bundle_by_id(
    db: Database, id: uuid.UUID, only_check_existence: Optional[bool] = False
) -> Union[Bundle, bool]:
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

    user = await get_user_by_field(db, field_name="uid", field_value=bundle.creator_uid)

    return Bundle(**dict(zip(bundle.keys(), bundle.values())), creator_username=user.username)


async def like_bundle(db: Database, bundle_id: uuid.UUID, user_uid: str):
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


async def unlike_bundle(db: Database, bundle_id: uuid.UUID, user_uid: str):
    try:
        query = delete(LikesTable).where(LikesTable.bundle_id == bundle_id).where(LikesTable.user_uid == user_uid)
        await db.execute(query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"取消点赞失败: {e}",
        )


async def get_bundle_likes_count(db: Database, bundle_id: uuid.UUID):
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


async def get_bundle_liked_by_user(db: Database, bundle_id: uuid.UUID, user_uid: str):
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


async def bookmark_bundle(db: Database, bundle_id: uuid.UUID, user_uid: str):
    query = (
        select([BookmarksTable]).where(BookmarksTable.bundle_id == bundle_id).where(BookmarksTable.user_uid == user_uid)
    )
    bookmark = await db.fetch_one(query)
    if bookmark:
        return

    try:
        query = insert(BookmarksTable).values(
            bookmarked_at=datetime.now().replace(microsecond=0), bundle_id=bundle_id, user_uid=user_uid
        )
        await db.execute(query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"收藏失败: {e}",
        )


async def unbookmark_bundle(db: Database, bundle_id: uuid.UUID, user_uid: str):
    try:
        query = (
            delete(BookmarksTable)
            .where(BookmarksTable.bundle_id == bundle_id)
            .where(BookmarksTable.user_uid == user_uid)
        )
        await db.execute(query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"取消收藏失败: {e}",
        )


async def get_bundle_bookmarks_count(db: Database, bundle_id: uuid.UUID):
    try:
        query = "SELECT COUNT(*) FROM bookmarks WHERE bundle_id = :bundle_id"
        values = {"bundle_id": bundle_id}
        count = await db.execute(query=query, values=values)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"获取收藏数失败: {e}",
        )

    return count


async def get_bundle_bookmarked_by_user(db: Database, bundle_id: uuid.UUID, user_uid: str):
    try:
        query = (
            select([BookmarksTable])
            .where(BookmarksTable.bundle_id == bundle_id)
            .where(BookmarksTable.user_uid == user_uid)
        )
        bookmarked = await db.fetch_one(query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"获取收藏状态失败: {e}",
        )

    return bookmarked


async def get_bundles_bookmarked_by_user(db: Database, user_uid: str, offset: int = 0, limit: int = 10):
    try:
        query = select([BookmarksTable]).where(BookmarksTable.user_uid == user_uid).offset(offset).limit(limit)
        bookmarked = await db.fetch_all(query)

        query = select([BundlesTable]).where(BundlesTable.id.in_([bookmark.bundle_id for bookmark in bookmarked]))
        bundles = await db.fetch_all(query)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"获取所有收藏素材失败: {e}",
        )

    return [BundleInDB(**dict(zip(bundle.keys(), bundle.values()))) for bundle in bundles]


async def create_subscription_order(db: Database, subscription_order: SubscriptionOrder):
    try:
        query = insert(SubscriptionOrdersTable).values(**subscription_order.dict())
        await db.execute(query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"创建订阅订单失败: {e}",
        )

    return subscription_order


async def get_subscription_order(db: Database, order_id: str):
    try:
        query = select([SubscriptionOrdersTable]).where(SubscriptionOrdersTable.id == order_id)
        order = await db.fetch_one(query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"获取订阅订单失败: {e}",
        )

    return order


async def set_subscription_order_status(db: Database, order_id: str, status: str):
    try:
        query = update(SubscriptionOrdersTable).where(SubscriptionOrdersTable.id == order_id).values(status=status)
        await db.execute(query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"设置订阅订单状态失败: {e}",
        )


async def create_subscription(db: Database, subscription: Subscription):
    try:
        query = insert(SubscriptionsTable).values(**subscription.dict(exclude={'id'}))
        id = await db.execute(query)
        subscription.id = id
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"创建订阅失败: {e}",
        )

    return subscription


async def get_subscription_by_order_id(db: Database, order_id: str):
    try:
        query = select([SubscriptionsTable]).where(SubscriptionsTable.order_id == order_id)
        subscription = await db.fetch_one(query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"获取订阅失败: {e}",
        )

    return subscription


async def create_purchase_order(db: Database, purchase_order: PurchaseOrder):
    try:
        query = insert(PurchaseOrdersTable).values(**purchase_order.dict())
        await db.execute(query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"创建购买订单失败: {e}",
        )

    return purchase_order


async def get_purchase_order(db: Database, order_id: str):
    try:
        query = select([PurchaseOrdersTable]).where(PurchaseOrdersTable.id == order_id)
        order = await db.fetch_one(query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"获取购买订单失败: {e}",
        )

    return order


async def set_purchase_order_status(db: Database, order_id: str, status: str):
    try:
        query = update(PurchaseOrdersTable).where(PurchaseOrdersTable.id == order_id).values(status=status)
        await db.execute(query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"设置购买订单状态失败: {e}",
        )


async def create_purchase(db: Database, purchase: Purchase):
    try:
        query = insert(PurchasesTable).values(**purchase.dict(exclude={'id'}))
        id = await db.execute(query)
        purchase.id = id
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"创建购买失败: {e}",
        )

    return purchase


async def get_purchase_by_order_id(db: Database, order_id: str):
    try:
        query = select([PurchasesTable]).where(PurchasesTable.order_id == order_id)
        purchase = await db.fetch_one(query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"获取购买失败: {e}",
        )

    return purchase
