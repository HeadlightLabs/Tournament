import json
import random

def process_post_response(response):
    """
        Convert a request response to json object
    """

    return json.loads(response.text)

def optimal_move(x,y):
    """
        Takes the current coordinates and figures out the best direction to move
    """

    # Consider all moves that can be made
    new_locations = _new_coordinates(x,y)

    # Remove any duplicates
    distinct_moves = list(set(new_locations))

    # Look for where the next move can scan the most area
    moves_with_areas = [_add_area(move) for move in distinct_moves]
    max_area = max(move['scan_area'] for move in moves_with_areas)

    optimal_moves = [move for move in moves_with_areas if move['scan_area'] == max_area]

    # If multiple directions have max scan area, go in a random direction
    # TODO: Potentially incorporate current nodes and mining activity into algorithm
    optimal_move = random.choice(optimal_moves)

    return optimal_move

def _new_coordinates(x,y,radius=1):
    """
        Return boundary checked new coordinates for a current set of coordinates and default radius
    """

    # Assume moving is better than staying in place
    return [(_check_boundary(x + radius), _check_boundary(y)),
            (_check_boundary(x), _check_boundary(y + radius)),
            (_check_boundary(x - radius), _check_boundary(y)),
            (_check_boundary(x), _check_boundary(y - radius)),
            (_check_boundary(x + radius), _check_boundary(y + radius)),
            (_check_boundary(x - radius), _check_boundary(y + radius)),
            (_check_boundary(x - radius), _check_boundary(y - radius)),
            (_check_boundary(x + radius), _check_boundary(y - radius))]

def _check_boundary(coordinate):
    """
        Given a set of coordinates, check whether we are still in the grid, default to boundary coordinates if not
    """

    if coordinate > 100:
        return 100
    elif coordinate < 0:
        return 0
    else:
        return coordinate

def _calculate_scan_area(x,y,radius=5):
    """
        Calculate the scan area for given coordinates
    """

    # Find diagnol Edges for 5 x 5 radius
    ne_edge = {'x': _check_boundary(x + radius), 'y': _check_boundary(y + radius)}
    sw_edge = {'x': _check_boundary(x - radius), 'y': _check_boundary(y - radius)}

    area = abs(ne_edge['x'] - sw_edge['x']) * abs(ne_edge['y'] - sw_edge['y'])

    return area

def _add_area(move):
    """
        Format the dictionary for the next move
    """

    return {
        'x': move[0],
        'y': move[1],
        'scan_area': _calculate_scan_area(move[0], move[1])
    }
