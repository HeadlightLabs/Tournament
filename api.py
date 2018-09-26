import requests
import json
import os

def post_request(path, data):
    host = os.environ['SERVER_HOST']
    port = os.environ['SERVER_PORT']
    endpoint = "http://" + host + ":" + port+ path
    json_data = json.dumps(data)
    response = requests.post(url = endpoint, data = json_data)
    response_content = json.loads(response.text)
    if not response_content or response_content.get('Error'):
        print response_content.get("ErrorMsg") or "Unknown Error"
        return None
    else:
        return json.loads(response.text)

def move(callsign, x, y):
    print 'Moving...'
    data = {'callsign': callsign, 'x': str(x), 'y': str(y)}
    return post_request('/move', data)


def mine(callsign, node_id):
    print 'Mining node: ' + node_id
    data = {'callsign': callsign, 'node': node_id}
    return post_request('/mine', data)

def claim(callsign, node_id):
    print 'Trying to claim node: ' + node_id
    data = {'callsign': callsign, 'node': node_id}
    return post_request('/claim', data)

def scan(callsign):
    print 'Scanning...'
    data = {'callsign': callsign}
    return post_request('/scan', data)

def register():
    data = {'callsign': ''}
    return post_request('/register', data)

def release(callsign, node_id):
    print 'Releasing node: ' + node_id
    data = {'callsign': callsign, 'node': node_id}
    return post_request('/release', data)
