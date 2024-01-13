import uuid
from datetime import datetime

from databases import Database
from fastapi import APIRouter, Depends, HTTPException, status

from ...db.connect import get_db
from ...db.core import (
    create_download,
    get_bundle_by_id,
    get_downloads_today,
    get_purchase_by_coins_by_user_bundle,
    get_purchase_by_user_bundle,
)
from ...models import User
from .auth import get_current_enabled_user
from .subscription import tiers

download_router = r = APIRouter()


@r.get("/download")
async def download(
    bundle_id: uuid.UUID,
    only_check_downloadable: bool = False,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    passed = False
    purchased = False
    subscribed = False

    # check if user has purchased the bundle
    purchase = await get_purchase_by_user_bundle(db, bundle_id, current_user.uid)
    purchase_by_coins = await get_purchase_by_coins_by_user_bundle(db, bundle_id, current_user.uid)
    if purchase or purchase_by_coins:
        passed = True
        purchased = True
    elif current_user.subscription:
        # check if user has a valid subscription and is within the daily download limits
        now = datetime.now().replace(microsecond=0)
        now_offset_aware = now.astimezone(current_user.next_billing_at.tzinfo)

        if current_user.next_billing_at > now_offset_aware:
            subscribed = True
            limits = tiers[current_user.subscription]['limits']

            downloads_today = await get_downloads_today(db, current_user.uid)

            downloaded_today = bundle_id in [download.bundle_id for download in downloads_today]

            # print(len(downloads_today), downloaded_today)

            if downloaded_today or len(downloads_today) < limits:
                passed = True

    bundle = await get_bundle_by_id(db, bundle_id, False, True)

    if only_check_downloadable:
        return False if not passed else bundle.bundle_url

    if not passed:
        if subscribed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="当日下载次数已达限额，请升级订阅后或明日再下载",
                headers={"WWW-Authenticate": "Bearer"},
            )
        elif not purchased:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="请先购买或订阅后再下载", headers={"WWW-Authenticate": "Bearer"}
            )

    if not purchased and not downloaded_today:
        await create_download(db, bundle_id, current_user.uid)

    return bundle.bundle_url
