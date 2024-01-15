import os
import random
import shutil
import uuid
from datetime import datetime
from typing import List

from databases import Database
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse

from ...config import ADMIN_SWITCH, ADMIN_UID
from ...db.connect import get_db
from ...db.core import (
    bookmark_bundle,
    create_bundle,
    delete_bundle_by_id,
    get_bundle_bookmarked_by_user,
    get_bundle_by_id,
    get_bundle_liked_by_user,
    get_bundle_likes_count,
    get_bundles_bookmarked_by_user,
    get_bundles_liked_by_user,
    get_bundles_of_all_users,
    get_bundles_published_by_user,
    get_bundles_purchased_by_user,
    get_num_of_bundles_bookmarked_by_user,
    get_num_of_bundles_liked_by_user,
    get_num_of_bundles_published_by_user,
    like_bundle,
    unbookmark_bundle,
    unlike_bundle,
    update_bundle_filed_by_id,
)
from ...models import BundleInDB, User
from .auth import get_current_enabled_user

# from PIL import Image, ImageOps


bundle_router = r = APIRouter()


@r.post("/bundle")
async def upload_bundle(
    title: str = Form(...),
    subtitle: str = Form(""),
    description: str = Form(""),
    tags: List[str] = Form([]),
    images: List[UploadFile] = File(...),
    bundle_url: str = Form(...),
    bundle_format: List[str] = Form(...),
    purchase_price: float = Form(10.0),
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    # TODO: check if current_user is admin/vip to gate uploading
    if ADMIN_SWITCH and current_user.uid != ADMIN_UID:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="上传权限错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

    while True:
        id = uuid.uuid4()
        exist = await get_bundle_by_id(db, id, only_check_existence=True)
        if not exist:
            break

    cache_fd = f'./static/cache/{id}'
    if not os.path.exists(cache_fd):
        os.makedirs(cache_fd)

    names = []
    namesWithExt = []
    for i, image in enumerate(images):
        content = await image.read()

        # Optional: check if image is valid
        # img = Image.open(image.file)
        # img = ImageOps.exif_transpose(img)

        ext = image.filename.split('.')[-1]

        name = 'cover'

        if i:
            while True:
                rnd_name = f'{random.randint(1, 1e3):03d}'
                exist = rnd_name in names
                if not exist:
                    break

            name = rnd_name

        with open(f'{cache_fd}/{name}.{ext}', 'wb') as f:
            f.write(content)

        names.append(name)
        namesWithExt.append(f'{name}.{ext}')

    new_bundle = await create_bundle(
        db,
        BundleInDB(
            id=id,
            title=title,
            subtitle=subtitle,
            description=description,
            tags=tags,
            cover=namesWithExt[0],
            carousel=namesWithExt[1:],
            bundle_url=bundle_url,
            format=bundle_format,
            purchase_price=purchase_price,
            created_at=datetime.now().replace(microsecond=0),
            creator_uid=current_user.uid,
        ),
    )

    shutil.move(cache_fd, './static/bundles')

    return new_bundle


@r.get("/bundle/public")
async def get_bundle_public(
    id: uuid.UUID,
    db: Database = Depends(get_db),
):
    return await get_bundle_by_id(db, id)


@r.get('/bundle')
async def get_bundle(
    id: uuid.UUID,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    bundle = await get_bundle_by_id(db, id, return_url=True)

    if current_user.uid != bundle.creator_uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="素材访问权限错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return bundle


@r.put("/bundle")
async def update_bundle(
    id: str = Form(...),
    title: str = Form(...),
    subtitle: str = Form(""),
    description: str = Form(""),
    tags: List[str] = Form([]),
    images: List[str | UploadFile] = File(...),
    bundle_url: str = Form(...),
    bundle_format: List[str] = Form(...),
    purchase_price: float = Form(10.0),
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    bundle = await get_bundle_by_id(db, id, return_url=True)
    if bundle.creator_uid != current_user.uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="素材修改权限错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

    keep = set([image for image in images if isinstance(image, str)])

    cache_fd = f'./static/cache/{id}'
    if not os.path.exists(cache_fd):
        os.makedirs(cache_fd)

    bundle_fd = f'./static/bundles/{id}'

    names = []
    namesWithExt = []
    for i, image in enumerate(images):
        if isinstance(image, str):
            name, ext = image.split('.')

            if i == 0 and name != 'cover':
                shutil.copy2(f'{bundle_fd}/{image}', f'{cache_fd}/cover.{ext}')
                name = 'cover'

            if i and name == 'cover':
                while True:
                    rnd_name = f'{random.randint(1, 1e3):03d}'
                    exist = f'{rnd_name}.{ext}' in keep or rnd_name in names
                    if not exist:
                        break

                shutil.copy2(f'{bundle_fd}/{image}', f'{cache_fd}/{rnd_name}.{ext}')
                name = rnd_name

            keep.remove(image)
        else:
            content = await image.read()

            # Optional: check if image is valid
            # img = Image.open(image.file)
            # img = ImageOps.exif_transpose(img)

            ext = image.filename.split('.')[-1]

            name = 'cover'

            if i:
                while True:
                    rnd_name = f'{random.randint(1, 1e3):03d}'
                    exist = f'{rnd_name}.{ext}' in keep or rnd_name in names
                    if not exist:
                        break

                name = rnd_name

            with open(f'{cache_fd}/{name}.{ext}', 'wb') as f:
                f.write(content)

        names.append(name)
        namesWithExt.append(f'{name}.{ext}')

    updates = {}

    if title != bundle.title:
        updates['title'] = title

    if subtitle != bundle.subtitle:
        updates['subtitle'] = subtitle

    if description != bundle.description:
        updates['description'] = description

    if tags != bundle.tags:
        updates['tags'] = tags

    if namesWithExt[0] != bundle.cover:
        updates['cover'] = namesWithExt[0]

    if namesWithExt[1:] != bundle.carousel:
        updates['carousel'] = namesWithExt[1:]

    if bundle_url != bundle.bundle_url:
        updates['bundle_url'] = bundle_url

    if bundle_format != bundle.format:
        updates['format'] = bundle_format

    if purchase_price != bundle.purchase_price:
        updates['purchase_price'] = purchase_price

    if updates:
        await update_bundle_filed_by_id(db, id, updates)

    for image in os.listdir(cache_fd):
        shutil.move(f'{cache_fd}/{image}', f'{bundle_fd}/{image}')

    shutil.rmtree(cache_fd)

    for image in os.listdir(bundle_fd):
        if image not in namesWithExt:
            os.remove(f'{bundle_fd}/{image}')

    return await get_bundle_by_id(db, id)


@r.delete("/bundle")
async def delete_bundle(
    id: uuid.UUID,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    await delete_bundle_by_id(db, id)

    # keep bundle_fd for soft delete
    # bundle_fd = f'./static/bundles/{id}'
    # shutil.rmtree(bundle_fd)

    return JSONResponse(status_code=200, content={"detail": "删除素材成功"})


@r.get("/bundle/all_published")
async def get_bundles_published(
    offset: int = 0,
    limit: int = 10,
    with_liked: bool = False,
    with_bookmarked: bool = False,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    bundles = await get_bundles_published_by_user(db, current_user.uid, offset, limit, with_liked, with_bookmarked)
    return bundles


@r.get("/bundle/num_of_all_published")
async def get_num_of_bundles_published(
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    return await get_num_of_bundles_published_by_user(db, current_user.uid)


@r.post("/bundle/like")
async def like_bundle_r(
    id: uuid.UUID,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    await like_bundle(db, id, current_user.uid)
    return JSONResponse(status_code=200, content={"detail": "点赞成功"})


@r.delete("/bundle/unlike")
async def unlike_bundle_r(
    id: uuid.UUID,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    await unlike_bundle(db, id, current_user.uid)
    return JSONResponse(status_code=200, content={"detail": "取消点赞成功"})


@r.get("/bundle/num_of_likes")
async def get_bundle_num_of_likes(
    id: uuid.UUID,
    db: Database = Depends(get_db),
):
    num_of_likes = await get_bundle_likes_count(db, id)
    return num_of_likes


@r.get("/bundle/liked")
async def get_bundle_liked(
    id: uuid.UUID,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    liked = await get_bundle_liked_by_user(db, id, current_user.uid)
    return True if liked else False


@r.get("/bundle/all_liked")
async def get_bundles_liked(
    offset: int = 0,
    limit: int = 10,
    with_bookmarked: bool = False,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    bundles = await get_bundles_liked_by_user(db, current_user.uid, offset, limit, with_bookmarked)
    return bundles


@r.get("/bundle/num_of_all_liked")
async def get_num_of_bundles_liked(
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    return await get_num_of_bundles_liked_by_user(db, current_user.uid)


@r.post("/bundle/bookmark")
async def bookmark_bundle_r(
    id: uuid.UUID,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    await bookmark_bundle(db, id, current_user.uid)
    return JSONResponse(status_code=200, content={"detail": "收藏成功"})


@r.delete("/bundle/unbookmark")
async def unbookmark_bundle_r(
    id: uuid.UUID,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    await unbookmark_bundle(db, id, current_user.uid)
    return JSONResponse(status_code=200, content={"detail": "取消收藏成功"})


@r.get("/bundle/bookmarked")
async def get_bundle_bookmarked(
    id: uuid.UUID,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    bookmarked = await get_bundle_bookmarked_by_user(db, id, current_user.uid)
    return True if bookmarked else False


@r.get("/bundle/all_bookmarked")
async def get_bundles_bookmarked(
    offset: int = 0,
    limit: int = 10,
    with_liked: bool = False,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    bundles = await get_bundles_bookmarked_by_user(db, current_user.uid, offset, limit, with_liked)
    return bundles


@r.get("/bundle/num_of_all_bookmarked")
async def get_num_of_bundles_bookmarked(
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    return await get_num_of_bundles_bookmarked_by_user(db, current_user.uid)


@r.get("/bundle/all_purchased")
async def get_bundles_purchased(
    offset: int = 0,
    limit: int = 10,
    with_liked: bool = False,
    with_bookmarked: bool = False,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    bundles = await get_bundles_purchased_by_user(db, current_user.uid, offset, limit, with_liked, with_bookmarked)
    return bundles


@r.get("/bundle/all/public")
async def get_bundles_all_public(
    offset: int = 0,
    limit: int = 10,
    db: Database = Depends(get_db),
):
    bundles = await get_bundles_of_all_users(db, None, offset, limit, False, False, False)
    return bundles


@r.get("/bundle/all")
async def get_bundles_all(
    offset: int = 0,
    limit: int = 10,
    with_liked: bool = False,
    with_bookmarked: bool = False,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    bundles = await get_bundles_of_all_users(db, current_user.uid, offset, limit, with_liked, with_bookmarked, False)
    return bundles
