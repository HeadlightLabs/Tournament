import requests
import json
import os
from ratelimiter import RateLimiter

HOST = os.environ["SERVER_HOST"]
PORT = os.environ["SERVER_PORT"]
BASE_URL = f"http://{HOST}:{PORT}"

MAX_CALLS_PER_SEC = 10


@RateLimiter(max_calls=MAX_CALLS_PER_SEC, period=1)
def post(path, data):
    """
    Sends a POST request using the requests library to a specific endpoint.
    """
    endpoint = f"{BASE_URL}{path}"
    data = json.dumps(data)
    return requests.post(url=endpoint, data=data)
