import network
import json
from models.node import Node
import heapq
import math

# Map constants
MAP_SIZE = 101

# Statuses
bot_status = {}
nodes_status = {}  # id: Node pairs

visited_observation_pts = [[False] * 9 for _ in range(9)]
claims = []  # Min-heap for holding the 3 best nodes
heapq.heapify(claims)


def register(callsign):
    data = {"callsign": callsign}
    response = network.post("/register", data)

    if is_good_response(response):
        update_bot_status(response.text)
    else:
        error_msg = response.json()["ErrorMsg"]
        raise Exception(f"Unable to register callsign: {error_msg}")


def move(target_x, target_y):
    """Moves the drone one space at a time to given coordinates."""
    if not 0 <= target_x <= MAP_SIZE or not 0 <= target_y <= MAP_SIZE:
        raise Exception(f"Invalid coordinates: ({target_x}, {target_y})")

    response = None
    cur_x = bot_status["Location"]["X"]
    cur_y = bot_status["Location"]["Y"]

    while cur_x != target_x or cur_y != target_y:
        x_dir = get_move_direction(cur_x, target_x)
        y_dir = get_move_direction(cur_y, target_y)

        new_x = cur_x + x_dir
        new_y = cur_y + y_dir

        data = {"callsign": bot_status["Id"], "X": str(new_x), "Y": str(new_y)}
        response = network.post("/move", data)

        if is_good_response(response):
            cur_x = new_x
            cur_y = new_y
        else:
            error_msg = response.json()["ErrorMsg"]
            raise Exception(f"Unable to move from ({cur_x}, {cur_y}) to ({new_x}, {new_y}): {error_msg}")

    update_bot_status(response.text)


def get_nearest_observation_pt():
    """
    Gets the nearest observation point.
    (Not the best way but time was short.)
    """
    best_x = cur_x = bot_status["Location"]["X"]
    best_y = cur_y = bot_status["Location"]["Y"]
    min_dist = float('inf')

    best_i = -1
    best_j = -1

    for i in range(9):
        for j in range(9):
            if not visited_observation_pts[i][j]:
                candidate_x = 11 * i + 5
                candidate_y = 11 * j + 5
                candidate_dist = get_distance(cur_x, cur_y, candidate_x, candidate_y)

                if candidate_dist < min_dist:
                    min_dist = candidate_dist

                    best_x = candidate_x
                    best_y = candidate_y

                    best_i = i
                    best_j = j

    visited_observation_pts[best_i][best_j] = True
    if min_dist != float('inf'):
        return (best_x, best_y)


def get_distance(x1, y1, x2, y2):
    return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)


def scan():
    data = {"callsign": bot_status["Id"]}
    response = network.post("/scan", data)

    if is_good_response(response):
        return get_nodes(response.text)
    else:
        error_msg = response.json()["ErrorMsg"]
        raise Exception(f"Unable to scan: {error_msg}")


def claim(node_id):
    """
    Claims a nearby node.

    If we have available claims or our claims are full but we found a better node:
     1. Release a claim if full.
       - Pop the heap
     2. Claim the better node.
       - Push to the heap
    """
    data = {"callsign": bot_status["Id"], "node": node_id}
    node = nodes_status[node_id]

    if (node.value) and (len(claims) < 3 or (len(claims) == 3 and node.value > claims[0].value)):
        if len(claims) == 3:
            popped_node = heapq.heappop(claims)
            release(popped_node.id)

        claim_response = network.post("/claim", data)

        if is_good_response(claim_response):
            update_bot_status(claim_response.text)
            get_nodes(claim_response.text)
            heapq.heappush(claims, node)
        else:
            error_msg = claim_response.json()["ErrorMsg"]
            raise Exception(f"Unable to claim node: {error_msg}")


def sweep_claims():
    """
    Visit each claimed node and mine it out. (Endgame action)
    """
    for c in claims:
        x, y = c.x, c.y
        move(x, y)
        mine_fully(c.id)


def mine(node_id):
    data = {"callsign": bot_status["Id"], "node": node_id}
    response = network.post("/mine", data)

    if is_good_response(response):
        update_bot_status(response.text)
        return get_nodes(response.text)
    else:
        error_msg = response.json()["ErrorMsg"]
        raise Exception(f"Unable to mine node: {error_msg}")


def mine_fully(node_id):
    while node_id in nodes_status and nodes_status[node_id].value > 0:
        mine(node_id)


def release(node_id):
    data = {"callsign": bot_status["Id"], "node": node_id}
    response = network.post("/release", data)

    if is_good_response(response):
        update_bot_status(response.text)
        return get_nodes(response.text)
    else:
        raise Exception(f"Node ID is incorrect or node is not currently claimed.")


def get_move_direction(start_coord, end_coord):
    """Determine which direction to increment the abscissa/ordinate."""
    diff = start_coord - end_coord

    if diff > 0:
        return -1
    elif diff == 0:
        return 0
    else:
        return 1


def is_good_response(response):
    return response.status_code == 200 and not bool(response.json()["Error"])


def update_bot_status(response_text):
    global bot_status
    response = json.loads(response_text)
    bot_status = response["Status"]


def get_nodes(response_text):
    """
    Records the coordinates, values, and claim statuses of nearby nodes.
    Returns a list of the nearby nodes as Node objects.

    (Needs a better method name)
    """
    global nodes_status
    response = json.loads(response_text)
    nodes_json = response["Nodes"]
    output = []

    for node in nodes_json:
        id = node["Id"]

        x = node["Location"]["X"]
        y = node["Location"]["Y"]
        value = node["Value"]
        claimed = node["Claimed"]

        if id in nodes_status:
            nodes_status[id].value = value
            nodes_status[id].claimed = claimed
        else:
            nodes_status[id] = Node(id, x, y, value, claimed)

        output.append(nodes_status[id])

    return output


def print_bot_status():
    global bot_status
    if bot_status.get("Id") is None:
        return
    print("\n===== STATUS ======")
    print("Callsign: " + bot_status["Id"])
    print("Claims: " + str(bot_status["Claims"]))
    print("Location (x,y): " + str(bot_status["Location"]))
    print("Score: " + str(bot_status["Score"]))
    print("===================\n")
