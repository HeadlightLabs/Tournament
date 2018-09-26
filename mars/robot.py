from web import send_post_request
from helpers import process_post_response, optimal_move
from exceptions import ApiResultError

class Robot(object):
    """
        Robot class to interact with the CMS Api and maintain state

        Attributes:
        id (str): The randomly generated id from the CMS API.
        X (int): The current x coordinate of the robot in the CMS grid.
        Y (int): The current y coordinate of the robot in the CMS grid.
        score (int): The current score of the robot in the CMS grid.

        Note: For each API call update state
    """


    def __init__(self):
        self.id = None
        self.X = None
        self.Y = None
        self.score = None

    def _set_state(self, data):
        """
            Method to update state after every API call
        """

        self.id = data.get('Status', {}).get('Id')
        self.X = data.get('Status', {}).get('Location', {}).get('X')
        self.Y = data.get('Status', {}).get('Location', {}).get('Y')
        self.score = data.get('Status', {}).get('Score')

    def id(self):
        return self.id

    def x_coord(self):
        return self.X

    def y_coord(self):
        return self.Y

    def score(self):
        return self.Y

    def print_state(self):
        print(f'{self.id} -- {self.X} -- {self.Y} -- {self.score}')

    def register(self, callsign):
        payload = {'callsign': callsign}

        response = send_post_request('/register', payload)
        data = process_post_response(response)

        self._set_state(data)

    def move(self):
        move = optimal_move(self.X, self.Y)
        payload = {'callsign': self.id, 'x': str(move['x']), 'y': str(move['y'])}

        response = send_post_request('/move', payload)
        data = process_post_response(response)

        self._set_state(data)

    def scan(self):
        payload = {'callsign': self.id}

        response = send_post_request('/scan', payload)
        data = process_post_response(response)

        self._set_state(data)
        return data

    def claim(self, node):
        payload = {'callsign': self.id, 'node': node}

        response = send_post_request('/claim', payload)
        data = process_post_response(response)

        if data['Error']:
            raise ApiResultError

        self._set_state(data)

    def release(self, node):
        payload = {'callsign': self.id, 'node': node}

        response = send_post_request('/release', payload)
        data = process_post_response(response)

        self._set_state(data)

    def mine(self, node):
        payload = {'callsign': self.id, 'node': node}

        response = send_post_request('/mine', payload)
        data = process_post_response(response)

        self._set_state(data)
        return data
