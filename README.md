### Mars Mining Challenge

#### Purpose
    - The purpose of this assignment was to implement an algorithm that would traverse a field of nodes and mine as many nodes as possible within the least amount of moves.

#### Instructions
    - Install Cocoapods (If not already installed)
    - Execute pod install
    - Open .xcworkspace file and run project
    
#### Tradeoffs
    - As a mobile developer, I wrote this program in Swift. The program requires XCode in order to run successfully. 
    I wanted to create a shell script to compile and execute the .swift files but ran out of time.
        - Since I didn't have time to implement an executable CL shell for this, I was not able to include argument calls. This program is wired to "http://localhost:5000"
    - The API wasn't descriptive of nullable fields, so in order to ensure some data was returned, I set all network fields to be optional

#### Challenges 
    - I spent some time trying to implement the register method, it turns out the field for the callsign IS NOT optional and needs to be included
    - I wasn't able to optimally implement Dijkstra's algorithm before time ran out.
    - I wasn't able to include unit tests before time ran out, luckily the network layer was tested from the server, with Observables I was able to reduce the number of lines of code that would need tests.
        - Ideally, I would like to test my implementation of Dijkstra's algorithm but I did not complete it.
        
