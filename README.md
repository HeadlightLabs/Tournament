
Hi - Please find my attached Bot program.

I had a lot of fun with this - so thanks again for reaching out and inviting me to join in your challenge!

I'd like to tell you a little bit about my process and how I approached this challenge.

First - given the time constraint, I knew I could not do everything I would have wanted - so my first goal was to pick a plan and stick with it.

I spent maybe the first 30 min reading the API documentation, hoping to better understand the problem.

Following that - I spent about 20 min brainstorming what Algorithm I would want to Bot to be using.  My final algorithm is based on two thoughts :

* Given that the Scan radius is 5 x 5, my first thought was that I would try to avoid scanning too close any edges - I really wanted to make sure I was always scanning 25 blocks.
* Also - I figure I would want to avoid scanning the same block more than once


With these two thoughts as my anchor - I decided that I would try to compute a list which coordinates on the Grid would (1) avoid scanning too close to the edge and (2) also avoid scanning blocks multiple times.

So for example - on a 100 by 100 grid, with a 5 by 5 scan radius, my first potential scan location would be (3, 3), and the next would be (3, 8).  These two points are far enough from the edge and also from each other to satisfy my constraints.  It is possible to calculate all such coordinates - which I call "Optimal Scanning Locations"

So essentially - My algorithm first starts by computing all of the optimal scanning locations - and then basically just moves the Bot directly to those coordinates.

Of course - When the Bot registers - it is placed at a random location.  In order to be efficient - my Bot will start by finding the closest "Optimal Scanning Location" - and then just iterate through my list to the next spot.

The bot prints some information about it's journey, most importantly it's current Score.

Some technical notes on my solution

* To help isolate my Bot Logic - I wrote a Utility class to handle making the API calls
* My API calls are also protected by a function decorator to help ensure that the API rate limit is respected
* The Grid size and scan distance are variable - and can be tweaked to fit problems of different size.  All of my logic is built on variables - and not hardcoded sizes - this helps make the algorithm more extensible.
* My bot was tested both Locally and against the Remote Heroku instances of the CMS API



If I had more time

There is room for a few tweaks that would make my bot more efficient

* Iterating through my optimal coordinates is efficient while working left to right - but when it moves down a row - it walks all the way back to x=0.  A more efficient path would be to "Scan" on the way back to 0, rather than moving to the start of the row - and scanning on the way back to the end
* When my bot does scan - it attempts to Mine the first block it finds - really it should be attempting to mine the Node with the highest value first - that would increase the chance of claiming the higher value nodes before anyone else
* My bot only attempts to mine 1 node at a time - I was not super sure what the limit was - and did not take time to experiment.  I think there is room most likely to have many nodes mined at once - but current I mine 1 at a time.
* I would add Unit tests around the math and logic functions in my Bot
* I also might make some Class extensions of the Bot to attempt other variations of the algorithm - and perhaps run some simulations and see which would perform better
