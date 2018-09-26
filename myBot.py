import time
import random
import json
import requests
from collections import deque
import operator

SERVER_HOSTS=["headlight-tournament-1.herokuapp.com",
              "headlight-tournament-2.herokuapp.com",
              "headlight-tournament-3.herokuapp.com",
              "headlight-tournament-4.herokuapp.com",
              "headlight-tournament-5.herokuapp.com"]
SERVER_HOST="headlight-tournament-5.herokuapp.com"
SERVER_PORT="80"

bot_status = {}
max_trail = 5
bot_trail = deque(maxlen=max_trail)

def send_post_request(path, data):
    """
        Sends a POST request using the requests library to a specific endpoint.
    """
    host = SERVER_HOST
    port = SERVER_PORT
    endpoint = f'http://{host}:{port}{path}'
    data = json.dumps(data)
    return requests.post(url = endpoint, data = data)

def scan():
    data = {'callsign': bot_status['Id']}
    return send_post_request('/scan', data)

def claim():
    data = {'callsign': bot_status['Id']}
    return send_post_request('/claim', data)

def release(node):
    data = {'callsign': bot_status['Id'], 'node':node}
    return send_post_request('/mine', data)

def mine(node):
    data = {'callsign': bot_status['Id'], 'node':node}
    return send_post_request('/mine', data)

def update_status(new_status):
  global bot_status
  response = json.loads(new_status)
  bot_status = response['Status']
  bot_status['xy'] = (bot_status['Location']['X'],bot_status['Location']['Y'])

def print_bot_status():
  global bot_status
  if bot_status.get('Id') == None:
    return
  print('\n\n===== STATUS ======')
  print('Callsign: ' + bot_status['Id'])
  print('Claims: ' + str(bot_status['Claims']))
  print('Location (x,y): ' + str(bot_status['Location']))
  print('Score: ' + str(bot_status['Score']))
  print('===================\n\n')


def register(callsign):
  data = {'callsign': callsign}
  return send_post_request('/register', data)

def move(x, y):
  data = {'callsign': bot_status['Id'], 'x': str(x), 'y': str(y)}
  return send_post_request('/move', data)

def move_random():
    while True:
        while True:
            dist_x = random.randint(0, 2) - 1
            dist_y = random.randint(0, 2) - 1
            if dist_x != 0 and dist_y != 0:
                break
        (new_x,new_y) = tuple(map(operator.add, bot_status['xy'], (dist_x,dist_y)))
        if new_x < 0 or new_x > 100 or new_y < 0 or new_y > 100:
            continue
        if (new_x,new_y) in bot_trail:
            continue
        r = move(new_x, new_y)

        if r.status_code != 200:
            print("Error moving, status:",r.status_code)
            continue;
        resp = json.loads(r.text)
        if resp['Error']=='true':
            print("Error moving, ErrorMsg:",resp['ErrorMsg'])
            continue;
        break;
    #print("Moved to ",new_x,new_y)
    bot_trail.append((new_x,new_y))
    return r

def scan_and_claim():
    r = scan()
    resp = json.loads(r.text)

    if len(resp['Nodes']) > 0:
        print ("Claim available nodes:",resp['Nodes'])
        r = claim()
        print("claim r=",r,r.text)
        resp = json.loads(r.text)
        if len(resp['Nodes']) > 0:
            print ("Claimed nodes:",resp['Nodes'])
        return resp['Nodes']
    else:
        return []

def run():
  while True:
    if bot_status.get('Id') == None:
      print("Registering...")
      r = register("")
      update_status(r.text)
      continue

    r = move_random()
    update_status(r.text)
    while True:
        nodes = scan_and_claim()
        for node in nodes:
            while True:
                print("MINING :)")
                r=mine(node)
                resp = json.loads(r.text)
                print("mined ",r,r.text.resp)
                if r.status_code != 200 or resp['Error'] == 'true' or resp['Score'] == 0:
                    break;
            release(node)
        break;
    print_bot_status()

run()
