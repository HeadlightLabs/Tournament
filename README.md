While designing the approach I was paying more attention to not getting stuck into moving into a small closed area.

So Added deque bot_trail with size max_trail. Used deque in order to be able to revisit some areas again after going away for a while and then exploring nearby areas.

If deque is too long then it will restrict movement all together and restrict to one section if the queue touches two edges of the 100x100 mesh.

So size of queue should be small.

For enhancement I would create multiple threads on multiple servers provided. Also instead of passing one node to mine(), passing whole array returned by claim.
