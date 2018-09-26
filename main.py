import bot

CALLSIGN = "capitalism on mars"

# A 9x9 matrix for tracking the visit status of each optimal scan location
visited_observation_pts = [[False] * 9 for _ in range(9)]


def run():
    try:
        print("Registering callsign...")
        bot.register(CALLSIGN)
        bot.print_bot_status()

        # Scan and claim right at spawn
        print("Scanning spawn...")
        nodes = bot.scan()

        for n in nodes:
            print(f"Found node: {n.id} - {n.claimed} - {n.value}")
            if not n.claimed and n.value > 0:
                print(f"Claiming node id: {n.id} - {n.value}")
                bot.claim(n.id)

            bot.print_bot_status()

        # Visit observation points, then scan and claim.
        obs_pt = bot.get_nearest_observation_pt()
        while obs_pt:
            bot.move(obs_pt[0], obs_pt[1])
            nodes = bot.scan()
            bot.print_bot_status()

            for n in nodes:
                print(f"Found node: {n.id} - {n.claimed} - {n.value}")
                if not n.claimed and n.value > 0:
                    print(f"Claiming node id: {n.id} - {n.value}")
                    bot.claim(n.id)

            obs_pt = bot.get_nearest_observation_pt()

        # Return to our top claims and mine them out
        bot.sweep_claims()
        bot.print_bot_status()

    except Exception as error:
        print(error)


if __name__ == "__main__":
    run()
