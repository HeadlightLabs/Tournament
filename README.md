My robot chugs along the X axis looking for free claims.  When it finds one it mines each node on the claim.  It then releases the node and moves on looking for another one.   I'm not quite sure how much time will be dedicated for each robot, so I'm sorting each claims nodes based on value. I then mine that one and pop it off the list.  I continue like this until all nodes are exhausted.

Ideally I'd like to have made my robot more optimal in searching as right now it will stop when y hits 0 or 100, but I just didn't have the time.  Unfortunately I was away this weekend, so had to fit this in somewhat at the last moment.

I wanted to keep my code as  simple and easy to read as possible, so I used promises and async await instead of callbacks.  I'm not as well versed with async await and found I wasn't able to use it every where I thought I could.  It definitely made for some interesting challenges.
