from typing import Callable

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from ..db.connect import close_db_connection, connect_to_db
from .routes.auth import auth_router
from .routes.bundle import bundle_router
from .routes.download import download_router
from .routes.payment_notify import payment_notify_router
from .routes.purchase import purchase_router
from .routes.subscription import subscription_router


def create_start_app_handler(app: FastAPI) -> Callable:
    async def start_app() -> None:
        await connect_to_db(app)

    return start_app


def create_stop_app_handler(app: FastAPI) -> Callable:
    async def stop_app() -> None:
        await close_db_connection(app)

    return stop_app


def get_application():
    app = FastAPI(title="UIBBX", docs_url="/docs", openapi_url="/openapi.json")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_event_handler("startup", create_start_app_handler(app))
    app.add_event_handler("shutdown", create_stop_app_handler(app))

    app.mount("/static", StaticFiles(directory="static"), name="static")

    app.include_router(auth_router)
    app.include_router(bundle_router)
    app.include_router(subscription_router)
    app.include_router(purchase_router)
    app.include_router(payment_notify_router)
    app.include_router(download_router)

    return app


app = get_application()
