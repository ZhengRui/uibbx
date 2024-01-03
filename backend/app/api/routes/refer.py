from databases import Database
from fastapi import APIRouter, Depends

from ...db.connect import get_db
from ...db.core import get_refers_rewarded_of_user
from ...models import User
from .auth import get_current_enabled_user
from .subscription import tiers

refer_router = r = APIRouter()


@r.get("/refer/all_rewarded")
async def get_refers_rewarded(
    offset: int = 0,
    limit: int = 10,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    refers = await get_refers_rewarded_of_user(db, current_user.uid, offset, limit)

    for refer in refers:
        refer_type = refer.refer_type
        if refer_type == "registration":
            refer.refer_type = "普通用户注册"
        else:
            [before, after] = refer_type[13:].split("->")
            if before == "none":
                refer.refer_type = f"VIP订阅: {tiers[after]['detail']['title']}"
            else:
                refer.refer_type = f"VIP升级: {tiers[before]['detail']['title']} -> {tiers[after]['detail']['title']}"

    return refers
