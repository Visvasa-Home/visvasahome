import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from shared.database import Base
import shared.models

dbs = [
    'visvasahome', 'visvasahome_auth', 'visvasahome_user', 
    'visvasahome_provider', 'visvasahome_catalog', 'visvasahome_booking',
    'visvasahome_payment', 'visvasahome_rating', 'visvasahome_outbox', 'visvasahome_chat'
]

async def create_all():
    for db in dbs:
        url = f"postgresql+asyncpg://visvasahome:visvasahome123@postgres:5432/{db}"
        engine = create_async_engine(url)
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            print(f"Tables created for {db}.")
        except Exception as e:
            print(f"Error for {db}: {e}")
        finally:
            await engine.dispose()

if __name__ == "__main__":
    asyncio.run(create_all())
