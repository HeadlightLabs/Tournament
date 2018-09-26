import requests
import json
import os
import time
from functools import wraps

def api_call_delay(func):
    @wraps(func)
    def wrapper(path, data):
        print(f'Sleep 1 second before calling {path} API to not exceed limits')
        time.sleep(1)
        return func(path,data)
    return wrapper

@api_call_delay
def send_post_request(path, data):
    """
        Sends a POST request using the requests library to a specific endpoint.
    """
    host = os.environ['SERVER_HOST']
    port = os.environ['SERVER_PORT']
    endpoint = f'http://{host}:{port}{path}'
    data = json.dumps(data)
    return requests.post(url = endpoint, data = data)
