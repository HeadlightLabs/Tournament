## Dependencies

I added requests to make easy post requests to the server. You can install
using the `setup.sh` script.

## Running my submission

You can run my submission using the `start.sh` script. It sets the environment
variables, and runs `bot.py`.

## Organization

I decided to divide up my main code into two files. `api.py` deals with all
requests to the server, while `bot.py` deals with the bot's logic.

I opted to use a class to keep track of the bot's status and nearby nodes,
rather than passing around data between functions or using a global variable.

## If I had more time

I'd like to have the bot move in a more effective way. I set directional
variable (north, south, east, and west) to control movement. Rather than having
the bot move randomly, it moves in one direction until it hits an edge, then
turns.

The downside, of course, is that the bot will simply go around the edges of the
area. I considered, and started to code, a method in which the edges would be
reassigned, so the bot would essentially go in smaller and smaller circles on
the map.

I didn't get a chance to finish the logic, but left the code anyway.
I anticipate it will run into a problem once it meets the middle of the board. 

## Error handling

I added some error handling logic in `api.py`, in case the server request
returned errors, however, given more time, I would add error handling for more
edge cases within the logic of the bot.

