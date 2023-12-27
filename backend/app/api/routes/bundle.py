import os
import random
import shutil
import uuid
from datetime import datetime
from typing import List

from databases import Database
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse

from ...db.connect import get_db
from ...db.core import (
    bookmark_bundle,
    create_bundle,
    get_bundle_bookmarked_by_user,
    get_bundle_by_id,
    get_bundle_liked_by_user,
    get_bundle_likes_count,
    get_bundles_bookmarked_by_user,
    get_bundles_liked_by_user,
    get_bundles_published_by_user,
    get_num_of_bundles_bookmarked_by_user,
    get_num_of_bundles_liked_by_user,
    get_num_of_bundles_published_by_user,
    like_bundle,
    unbookmark_bundle,
    unlike_bundle,
)
from ...models import BundleInDB, User
from .auth import get_current_enabled_user

# from PIL import Image, ImageOps


bundle_router = r = APIRouter()


@r.post("/bundle")
async def upload_bundle(
    title: str = Form(...),
    subtitle: str = Form(None),
    description: str = Form(None),
    tags: List[str] = Form(None),
    images: List[UploadFile] = File(...),
    bundle_url: str = Form(...),
    bundle_format: str = Form(...),
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    # TODO: check if current_user is admin/vip to gate uploading

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
    bundle = await get_bundle_by_id(db, id)

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
    subtitle: str = Form(None),
    description: str = Form(None),
    tags: List[str] = Form(None),
    images: List[str | UploadFile] = File(...),
    bundle_url: str = Form(...),
    bundle_format: str = Form(...),
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    # TODO: check if current_user is the creator of bundle

    print(
        id,
        title,
        subtitle,
        description,
        tags,
        [img if isinstance(img, str) else type(img) for img in images],
        bundle_url,
        bundle_format,
    )

    pass


@r.get("/bundle/all_published")
async def get_bundles_published(
    offset: int = 0,
    limit: int = 10,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    bundles = await get_bundles_published_by_user(db, current_user.uid, offset, limit)
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
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    bundles = await get_bundles_liked_by_user(db, current_user.uid, offset, limit)
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
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    bundles = await get_bundles_bookmarked_by_user(db, current_user.uid, offset, limit)
    return bundles


@r.get("/bundle/num_of_all_bookmarked")
async def get_num_of_bundles_bookmarked(
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    return await get_num_of_bundles_bookmarked_by_user(db, current_user.uid)
