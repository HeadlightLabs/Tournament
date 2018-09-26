# My solution attempt

I ran out of time before I could tackle the actual claiming and mining functionality. I felt like I spent too much time thinking of the optimal way to cover the entire area of the grid, and didn't realize how many small errors and hiccups I would run into that would eat into my time.

Regardless, I will explain my approach and the idea behind it.

## My approach

I spent the first 30 - 45 minutes reading through the API docs and instructions, trying to get a feel for how the grid is laid out, how the bot moves, how scanning, claiming, and mining works, etc. 
I found that it was significantly harder to visualize the challenge and how to approach it, when there was no nice UI or visual aid, and everything had to be imagined.

After I realized the grid layout and the fact that the bot can move 1 square in any direction, including diagonally, I immediately realized that moving diagonally was ideal, as each diagonal movement revealed 9 new squares to scan for nodes, whereas a vertical/horizontal movement reveals only 5.

Thus, my ultimate goal was to have a diagonal movement based area coverage algorithm, but before that I started with a much simpler algorithm, composed of two parts:

1. Moving to the origin
2. Using a snake-like, linear sweeping pattern to cover the grid.

The first part is accomplished by the closure generator ToOrigin(), which returns a method move() that always moves the bot towards the origin point. The origin point was set to be (3,3) instead of (0,0), to allow for maximum scan coverage.

The second part is handled by the closure generator Sweeper(), which returns a move() method that initially moves the bot to the right, until it hits the right edge. Then it moves the bot up by 5 squares (again, for maximum scan coverage on each pass), and then begins to move it left until the left edge is hit. This "sweeping" pattern continues until the bot reaches the top border, at which point it will have explored the entire grid.

## Explanation of variables/functions
- right/left/top/bottomBorder, scanRange, claimLimit:
These global variables represent the default constants for the challenge. The idea behind putting them in variables like this is extensibility: this program should function if, say, the scanRange was increased, or the grid size was doubled, or the claim limit was raised, etc.

- scanned, claims:
These arrays stored nodes that had been scanned and claimed, respectively.

- scan, claim, mine:
These were the basic functions designed to hit the API. 

- nextClaim:
This function pops the last node from the scanned array and tries to claim it. If the claim fails (e.g. someone else already claimed it), then the function recursively calls itself, to claim the second last node, and so on until the scanned array is empty.
The function returns the claimed node if it succeeded, else returns undefined.

- ToOrigin, Sweeper:
Explained above

## Final thoughts
Ultimately, the time limit was the real killer for me. I am normally the kind of person who spends the amount of time given, 4.5 hours, simply *thinking* about a solution, before even touching any code. Thus, in my rush to complete on time, I could not deal with all the bugs I encountered, much less create an ideal solution.

If I did have more time, one thing I would've definitely loved to do is to create a simple HTML page with a UI displaying the board, the bot, discovered nodes, etc. It would be tremendously helpful in debugging and visualizing if I could actually see what the bot was doing.

All in all, this was still a very fun and challenging experience, and I definitely learned a lot from it.