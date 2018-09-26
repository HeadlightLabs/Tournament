import json
import requests
import random
import time
import api

class Bot:
    NORTH = 0
    EAST = 2
    SOUTH = 3
    WEST = 4

    def __init__(self):
        self.claims = []
        self.location = {}
        self.score = 0
        self.callsign = ""
        self.nearby_nodes = []
        self.direction = self.NORTH
        self.edge = {
                'north': 5,
                'east': 95,
                'south': 95,
                'west': 5,
                }

    def register_if_needed(self):
        if not self.callsign:
            response = api.register()
            status = response.get('Status')
            self.callsign = status.get('Id')
            self.update_status(status)

    def update_status(self, status):
        self.claims = status.get('Claims')
        self.location = status.get('Location')
        self.score = status.get('Score')

    def print_status(self):
        print 'Callsign: ' + self.callsign
        print 'Claims: ' + ", ".join(self.claims)
        print 'Location: ' + str(self.location)
        print 'Score: ' + str(self.score)

    def scan_area(self):
        response = api.scan(self.callsign)
        self.update_status(response.get('Status'))
        self.nearby_nodes = response.get('Nodes')

    def check_for_nodes(self):
        if len(self.nearby_nodes) == 0:
            return False, 'No nearby nodes'
        else:
            unclaimed_nodes = self.check_nodes(self.nearby_nodes)
            if len(unclaimed_nodes) == 0:
                return False, 'No unclaimed nodes'
            else: 
                return True, unclaimed_nodes


    def check_nodes(self, nodes):
        return [node["Id"] for node in nodes if not node['Claimed'] and
        node['Value'] > 0]

    def get_node_value(self, node_id):
        node_info = (node for node in self.nearby_nodes if node["Id"] == node_id).next()
        return node_info.get('Value')

    def mine_claimed_node(self):
        claimed_node = self.claims[0]
        value = self.get_node_value(claimed_node)
        while int(value) > 0:
            print 'Node Value: ' + str(value)
            time.sleep(1)
            response = api.mine(self.callsign, claimed_node)
            self.update_status(response.get('Status'))
            self.nearby_nodes = response.get('Nodes')
            value = self.get_node_value(claimed_node)
        print 'Done mining node: ' + claimed_node

    def claim_and_mine(self, node_list):
        for node_id in node_list:
            response = api.claim(self.callsign, node_id)
            self.update_status(response.get('Status'))
            self.mine_claimed_node()
            self.release_claimed_node()

    def release_claimed_node(self):
        claimed_node = self.claims[0]
        response = api.release(self.callsign, claimed_node)
        self.update_status(response.get('Status'))

    def move_space(self):
        self.check_for_edge()
        next_x, next_y = self.next_position()
        api.move(self.callsign, next_x, next_y)

    def next_position(self):
        y_pos = self.location['Y']
        x_pos = self.location['X']
        if self.direction == self.NORTH:
            y_pos -= 1
        elif self.direction == self.EAST:
            x_pos += 1
        elif self.direction == self.SOUTH:
            y_pos += 1
        else:
            x_pos -=1
        return x_pos, y_pos

    def check_for_edge(self):
        ## if we hit an edge, we need to switch directions
        x_pos = self.location['X']
        y_pos = self.location['Y']
        if self.direction == self.NORTH and y_pos <= self.edge['north']:
            self.direction = self.EAST
            self.edge['north'] += 10
        elif self.direction == self.EAST and x_pos >= self.edge['east']:
            self.direction = self.SOUTH
            self.edge['east'] -= 10
        elif self.direction == self.SOUTH and y_pos >= self.edge['south']:
            self.direction = self.WEST
            self.edge['south'] -= 10
        elif self.direction == self.WEST and x_pos >= self.edge['west']:
            self.direction = self.NORTH
            self.edge['west'] += 10
        
def run():
    print "running"
    bot = Bot()
    bot.register_if_needed()
    while True:
        time.sleep(1)
        bot.print_status()
        bot.scan_area()
        response = bot.check_for_nodes()
        if not response[0]:
            bot.move_space()
        else:
            bot.claim_and_mine(response[1])
            bot.print_status()

run()
