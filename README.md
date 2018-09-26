# My Mining Bot

I didn't get as far as I would have liked here. I'm certainly frustrated I couldn't find a way to handle an error that happens when someone initially registers the bot and is not able to scan a node immediately. Having to stop when I still haven't fully formed the release piece for the bot is a shame, as I was really looking forward to finishing tackling that.

That all being said, I had a really good time with this and learned a ton of new tricks as I was going through the exercise. I intend to finish this on my own time, and thanks for letting me participate!

## Overall thoughts

I wasted a ton of time with the initial POST call, which retroactively was so silly. I was trying to run it through Postman to get a better idea of the object and really should have just worked with the request code from the demo, as it really wasn't all that complex ultimately.

I loved that you had a dynamic live server that was changing as other people mined as well. It really brought the whole thing to life for me and made me really engaged with trying to make everything work.

## Tradeoffs

I went with a random movement pattern, which isn't the best. I also was trying to get every claimed node into an array so that I could try and map through each one and flag them all in one claim process as opposed to claiming and mining one and leaving other potentially unclaimed and open for others to mine in the process.

I ultimately didn't really get to see that process all the way through, and was actually struggling a bit to dump the IDs I had captured during the release process (if you uncomment what I have in that piece you'll see what I mean).

## If I had more time

I feel like I've already covered this a bit above, but the array piece was a big missing piece for me. I would have also liked to try and play with mining more efficiently - making quick recursive calls within my function in order to live within the mining function until the value of the node was 0 and then just returning that it was empty back into my main runtime function in order to move on to the next claimed node, before ultimately moving the bot when I had no more node IDs on my array.

I also really wanted to try and add extra .js files for each part of the process. At one point I actually started setting up a file for global variable storage but thought it actually made the project harder to read through, so I axed hat.

As everything grew out it became a bit difficult to see where I was, but given my time constraints because of my hold up on using the API I couldn't really get to spreading each part of the mining process to it's own section of the project. It's another one of those things I'll probably be doing on my own time this weekend!

## Dependencies

Didn't really add anything here!

## Running my submission

Just a simple npm install and npm start should get you up and going. I was using the first server from heroku. If you take a look at package.json, I'm just having everything run out of bot.js and requiring the separate request file at the top similar to the example code you had to make sure everything runs through properly.
