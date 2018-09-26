from robot import Robot
from exceptions import ApiResultError

def _mine_claimed_node(robot, data, node_id):
    """
        Claim a node and then mine it to exhaustion
    """

    # Find first occurence of node in data
    mining_node = next((node for node in data['Nodes'] if node['Id'] == node_id), {})
    has_value = mining_node['Value']

    while mining_node and has_value:
        data = robot.mine(node_id)
        mining_node = next((node for node in data['Nodes'] if node['Id'] == node_id), {})
        has_value = mining_node['Value']

    robot.release(node_id)

def main():
    """
        Main script to be executed
    """
    robot = Robot()
    robot.register('')
    registered = robot.id

    while registered:
        data = robot.scan()
        current_claims = data.get('Status', {}).get('Claims')

        # May not need this condition since we may never get here due to second loop, but keeping in case of API suprises
        for node_id in current_claims:
            _mine_claimed_node(robot, data, node_id)

        data = robot.scan()

        # After scanning, basically try to claim and mine everything from scan results
        for node in data['Nodes']:
            node_id = node['Id']
            current_claims = data.get('Status', {}).get('Claims')
            already_claimed = node_id in current_claims

            if not node['Claimed'] and node['Value'] and not already_claimed:

                # Handling if we try to claim at the same time as another robot, go to next node if that's the case
                try:
                    robot.claim(node_id)
                except ApiResultError:
                    continue
                data = robot.mine(node_id)

                _mine_claimed_node(robot, data, node_id)

        robot.print_state()
        robot.move()

        # TODO: Will this ever just not return anything, maybe creating infinite loop
        registered = robot.id

if __name__ == '__main__':
    main()
