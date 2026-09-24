import os
import json
import redis.asyncio as redis
from shared.utils import logger

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
REDIS_CLUSTER_MODE = os.getenv("REDIS_CLUSTER_MODE", "false").lower() == "true"

if REDIS_CLUSTER_MODE:
    from redis.asyncio.cluster import RedisCluster
    # Hardened cluster mode for high availability (Redis Shards)
    redis_client = RedisCluster.from_url(REDIS_URL, decode_responses=True)
else:
    # Standard connection pool
    redis_client = redis.from_url(REDIS_URL, decode_responses=True, max_connections=100)

async def set_cache(key: str, value: any, ttl_seconds: int = None):
    try:
        val = json.dumps(value) if isinstance(value, (dict, list)) else value
        if ttl_seconds:
            await redis_client.setex(key, ttl_seconds, val)
        else:
            await redis_client.set(key, val)
    except Exception as e:
        logger.error(f"Redis set error: {e}")

async def get_cache(key: str):
    try:
        val = await redis_client.get(key)
        if val:
            try:
                return json.loads(val)
            except:
                return val
        return None
    except Exception as e:
        logger.error(f"Redis get error: {e}")
        return None

async def delete_cache(key: str):
    await redis_client.delete(key)

async def set_partner_online(partner_id: str, latitude: float, longitude: float):
    # Using Redis GEOADD
    # GEOADD key longitude latitude member
    await redis_client.geoadd("partners_geo", (longitude, latitude, partner_id))

async def set_partner_offline(partner_id: str):
    await redis_client.zrem("partners_geo", partner_id)

async def get_nearby_partners(latitude: float, longitude: float, radius_km: float):
    try:
        # GEORADIUS key longitude latitude radius m|km|ft|mi
        results = await redis_client.georadius("partners_geo", longitude, latitude, radius_km, unit="km")
        return results
    except Exception as e:
        logger.error(f"Redis geo search error: {e}")
        return []
