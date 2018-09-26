# Centaurus A's Headlight Challenge Submission

It was an interesting challenge. I know my code is very 'linear', meaning it could of been refactored in a way of getting the run time closer to O(n). But with the amount of time I had, and learning how to use Node.js + trial/error  the api, it turned out decent. 

I started this challenge based of what was in the example. Since I didn't know how to start a Node.js project and I didn't want to waste too much time, I copied the 'setup.sh', 'start.sh', and 'request.js' files. I figured those had the least impact on what I am being judged on. From there, these are the mental steps I took:

- I wrote the init() function as a switch in the steps that the bot should perform. So register, scan, claim, mine, release, and move. 
- Started each step with writing the endpoints that are connected to the API.
- Then wrote conditional functions to check whether I needed to do that step on this 'run'.
-- I only needed to register once.
-- For the scan, I kept a temp 'marsMap' to keep track of where I have already scanned and any existing nodes.
-- For claims, if the scan showed any nodes that weren't claimed/had value over 0, then I would add those to a temp 'claimed' map. This needed to get the current value of whatever node I had claimed. So when I mined, I can know the current value.
-- For mining, I had to check if I had any claimed  with value before mining it
-- For release, I had to check to make sure the claimed nodes had no more value to me before they were release.
-- For move, I checked which direction I had to move in a clock wise fashion. Depending on where the position, it will move 'east' till the edge of the 100x100 grid.  It then will move 'south' till the end of the grid. This will leave the bot at the bottom-right most point, before it will snake it self from right to left back up grid.
- At the end, where the bot cannot move any more, the interval around init() will end, and the bot will stop. 

I used lodash/underscore to help me find object in arrays or compare strings. 

