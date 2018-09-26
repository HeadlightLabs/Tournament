# [1] Scouting Phase

### Constants

From the Tournament API GitHub [repository](https://github.com/HeadlightLabs/Tournament-API), the following constants were observed:

- The mine is a 101x101 square matrix. `x := random.Intn(grid.Width + 1)`
	`y := random.Intn(grid.Height + 1)`
	- Tested by moving to (0, 0) and (100, 100).
- There are 80 nodes each with a random value between 1 and 21. `value := random.Intn(MAX_NODE_VALUE+1) + 1`
  - Depleted nodes will remain on the map with a value of 0.  
- Only 3 nodes can be claimed at any time.
- A scan will reveal nodes within an 11x11 square matrix centered on the drone's position (radius of 5 units in each cardinal direction). 
  - This was verified on the test server to rule out the possibilities of the radius measurement including the drone's position (9x9) and circular scan areas.

### Thoughts

Note: I'm assuming that the constants are accurate and that there will be 100–200 contestants competing in the same map, at the same time.

- Claiming nodes is the only way to impede opposing forces as there are no options to loot, block, or destroy enemy drones. Therefore, we should always try to have at least 2 nodes claimed for the purpose of resource denial. 
- Since there aren't enough nodes for everyone, lucky node spawns can heavily skew tournament results. Effective searching and claiming will be needed to overcome RNG.

### Possible Attack Vector
If a drone's callsign is known, re-registration will reset its score and randomize its location. While scans do not reveal callsigns, a dictionary-based brute-force attack might catch a few commonly used names.

- It would take 33 minutes to run through 20K words at the current rate limit.

# [2] Planning Phase

### Estimations

- Each node has an average value of 10.5 and there is an 0.8% chance of a space being a node.
- The scan outcomes for a newly visited 11x11 sector can be determined using the binomial distribution formula. 
  - [Online calculator](https://stattrek.com/online-calculator/binomial.aspx)

| Nodes revealed | Probability |
| -------------: | :---------- |
|              0 | 0.378366198 |
|              1 | 0.369212176 |
|              2 | 0.178651053 |
|              3 | 0.057149127 |
|     At least 1 | 0.621633802 |
|    More than 3 | 0.016621445 |

- The chances of finding 3 or more nodes are as follows:

| Scan sectors visited | P(3 or more nodes) |
| -------------------: | :----------------- |
|                    1 | 0.073770572        |
|                    2 | 0.305935534        |
|                    3 | 0.555800862        |
|                    4 | 0.743707705        |
|                    5 | 0.862263347        |
|                    6 | 0.929667429        |

- These calculations are based on the assumption that no other players are in the game. Hence, it is certain that actual probabilities will decrease as the tournament progresses.

### Optimal Scanning
There are 81 observation points that, if all visited, will reveal 99x99 units. They are located at `(11*i + 5, 11*j + 5)` where `i` and`j` are between 0 and 8.

### High Occupancy Caveat

Given 100-200 participants, the entire 101x101 map will be reasonably explored if each person scans 51-102 squares. This can be done with 1 scan per drone on the first turn.

### Thoughts
Early in the game, the goal is to reach the claim limit before attempting to mine. This will deny nearby drones access to the nodes while allowing our drone to continue exploring.

Due to the high number of competitors and rarity of nodes, it is very unlikely to encounter 3 unclaimed nodes. It is estimated that we will need to visit 3 scan sectors to have a coin flip's chance at filling up our claims. Therefore, discovery takes priority over mining.


# [3] Coding Phase

### Algorithm

I decided to go with a "top K largest elements" algorithm that simply tries to find the 3 best nodes in the entire map. This algorithm will likely perform terribly in larger and more bountiful maps.

1. Immediately scan and claim the best 3 nodes in the spawn sector.
2. Move to the nearest observation point. 
3. At each observation point:
  - Perform a scan. 
  - If the claim limit has not been reached, add nodes until it is full.
  - While there are better nodes in the current sector:
    - Release the worst claimed node and replace it with the better node.
  - Keep a record of all node coordinates, values, and claim statuses.
  - Repeat steps 2 and 3 until all observation points have been visited.
4. Return to our claims and mine all of them out.

### Pathfinding
It took a bit of searching since I wanted to visit each observation point once without repeating, but didn't know the term for this type of graph traversal. Eventually I stumbled upon the "[longest path problem](https://www.geeksforgeeks.org/find-the-longest-path-in-a-matrix-with-given-constraints/)" which can be solved using dynamic programming with a few tweaks for our case.

Unfortunately, I did not have enough time to implement this algorithm and settled for a simple closest point traversal.

### Edge Cases
- [x] Drone collision: *None. Drones can occupy the same space.*
- [x] Moving out of bounds: *Internal check only. API does not return an error.*
- [ ] Node claim race condition: *If claims are maxed out, a node must be released before claiming. This can result in the net loss of a node if another drone manages to claim the node right after the release. Try to recover by rescanning the area for another node to claim.*

## Given more time I would...

- Improve the pathfinding algorithm to solve the longest path problem.
- Implement a function to revisit all recorded unclaimed nodes.
- Improve the get_nearest_observation_pt() method to a O(1) solution regardless of map size.
- Explore a better strategy that takes value and distance into account before deciding to release a claim.
- Add recovery to the node claim race condition edge case. This could be something simple like reclaiming a released node if it is in the current sector.