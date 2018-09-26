from cms_api import CmsApi
import math

GRID_MAX_X = 100
GRID_MAX_Y = 100

SCAN_DISTANCE_X = 5
SCAN_DISTANCE_Y = 5


class Bot:
    """A bot for mining Prometheum"""

    def __init__(self, callsign):
        """Constructor for Bot"""

        # Register with the CMS
        print('Bot is coming online with callsign = {callsign}'.format(callsign=callsign))
        self.cms_api = CmsApi(callsign)
        registration_response = self.cms_api.register()

        # Handle registration Error
        if registration_response['Error']:
            raise Exception('Could not register with the CMS : {message}'.format(
                message=registration_response['ErrorMsg']
            ))

        # Save Starting Location
        self.location_x = registration_response['Status']['Location']['X']
        self.location_y = registration_response['Status']['Location']['Y']

        print("Starting location is ({x}, {y})".format(x=self.location_x, y=self.location_y))

        # Start the Bot's main routine
        self.main()

    def calculate_optimal_scan_locations(self):
        """Given the grid size and scan distance - calculate the optimal scan locations"""

        # Calculate Min + Max bounds - to avoid scanning too close to the Grid's edges
        min_x = math.ceil(SCAN_DISTANCE_X / 2)
        max_x = GRID_MAX_X - min_x
        min_y = math.ceil(SCAN_DISTANCE_Y / 2)
        max_y = GRID_MAX_Y - min_y

        # Find the optimal X and Y coordinates that allow for scans with minimal overla
        x_coords = range(min_x, max_x, SCAN_DISTANCE_X)
        y_coords = range(min_y, max_y, SCAN_DISTANCE_Y)

        # Produce final list of coords as all parings of optimal X and Y coords
        scan_locations = []
        for x_coord in x_coords:
            for y_coord in y_coords:
                scan_locations.append([x_coord, y_coord])

        return scan_locations

    def distance_between_points(self, x1, y1, x2, y2):
        """Return the distance between two points"""
        return abs(((x2 - x1) ** 2) + ((y2 - y1) ** 2))

    def find_nearest_scan_location(self, x, y, scan_locations):
        """For the given X, Y coordinate, returns the index of the closest scan location"""
        min_distince_found = float('inf')
        nearest_location_index = 0

        for index, scan_location in enumerate(scan_locations):
            loc_x, loc_y = scan_location
            distance = self.distance_between_points(x, y, loc_x, loc_y)
            if distance < min_distince_found:
                min_distince_found = distance
                nearest_location_index = index

        return nearest_location_index

    def move_to_coord(self, dest_x, dest_y):
        """Moves the bot from it's current location to the destination X, Y coords"""
        while self.location_x != dest_x and self.location_y != dest_y:
            x_delta = 0
            y_delta = 0

            if dest_x > self.location_x:
                x_delta = 1
            elif dest_x < self.location_x:
                x_delta = -1

            if dest_y > self.location_y:
                y_delta = 1
            elif dest_y < self.location_y:
                y_delta = -1

            move_response = self.cms_api.move(self.location_x + x_delta, self.location_y + y_delta)

            if move_response['Error']:
                # If there is an error moving - return and hope to try again later
                # I have not hit this error state yet
                return

            self.location_x = move_response['Status']['Location']['X']
            self.location_y = move_response['Status']['Location']['Y']

    def main(self):

        # First - Calculate the optimal scanning locations
        scan_locations = [i for i in self.calculate_optimal_scan_locations()]

        # Then - Find the optimal scanning location closest to my starting point
        nearest_scan_location_index = \
            self.find_nearest_scan_location(self.location_x, self.location_y, scan_locations)

        # Decrement index - will be incremented at the top of the Main Loop
        nearest_scan_location_index -= 1

        # Start Main Loop
        while True:

            # Find next optimal scanning location
            nearest_scan_location_index += 1
            if nearest_scan_location_index >= len(scan_locations):
                nearest_scan_location_index = 0
            next_scanning_location = scan_locations[nearest_scan_location_index]
            print("Moving to {location}".format(location=next_scanning_location))
            self.move_to_coord(*next_scanning_location)

            # First - Scan the current location for Nodes
            scan_response = self.cms_api.scan()

            # Check and report score
            score = scan_response['Status']['Score']
            print("Score is currently {score}".format(score=score))

            if not scan_response['Nodes']:
                print("No Nodes found - moving to next optimal scan location")
                continue

            print("{x} nodes found - ready to inspect".format(x=len(scan_response['Nodes'])))

            # For all of the nodes that are near by
            for node in scan_response['Nodes']:

                if node['Claimed'] or not node['Value']:
                    print("Skipping claimed or worthless Node")
                    # Skip this Node if it is already claimed or has no value
                    continue

                # Claim this node
                node_id = node['Id']
                claim_response = self.cms_api.claim(node_id)

                if claim_response['Error']:
                    # Skip this Node if Claim fails
                    continue

                print("Found Node {node_id} suitable for mining".format(node_id=node_id))

                # Attempt to Mine this Node while it still has Value left
                value_extracted = 0
                while node['Value']:
                    mine_response = self.cms_api.mine(node_id)
                    node['Value'] -= 1
                    value_extracted += 1

                    if mine_response['Error']:
                        # If Mining fails for any reason - Stop and move to the next node
                        break

                print("Extracted {value_extracted} Value from Node {node_id}".format(
                    value_extracted=value_extracted,
                    node_id=node_id
                ))

                # When mining is done - release the node
                release_response = self.cms_api.release(node_id)

                if release_response['Error']:
                    raise Exception("Error - can not release a Node - call for backup")

                print('Node {node_id} has been released'.format(node_id=node_id))


my_bot = Bot('Hades')
