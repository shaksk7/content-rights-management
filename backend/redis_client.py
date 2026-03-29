import redis
import os
from dotenv import load_dotenv

load_dotenv()

def get_redis():
    client = redis.from_url(os.getenv("REDIS_URL", "redis://redis:6379"))
    try:
        yield client
    finally:
        client.close()