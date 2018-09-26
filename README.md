# My awesome bot

I really enjoyed the competition and am always looking forward to feedback. I consider myself a junior engineer, having come from a non-traditional background, so I am always looking for ways to improve. I am hoping I did enough in this competition but the limited time was a factor. I had to focus on getting at least the minimum functionality done, but would have preferred to think about my algorithm a bit more.

Again thanks for the opportunity to demonstrate what I can do!

## Notes
- Used python3 as the language, no specific framework, and nothing besides requests library as a dependency
- I was able to setup the GO local server, but didn't know ultimately what should be in the start.sh script for submission, the local server or one of the hosted servers, so I went with the hosted server
- I am delaying each post request by a second to not hammer the API

My folder structure is as follows:
/mars
  bin.py - contains main script file to run algorithm
  exceptions.py - contains custom error classes
  helpers.py - contains the helper methods needed by the Robot class
  robot.py - contains the Robot class
  web.py - contains the API request methods
/tests
  /unit
    test_mars.py - contains unit tests for the helper methods

## Overall Approach

My approach was to go the object oriented route since there was state that needed to be maintained as the robot navigates the 100 x 100 grid. I created a Robot class in order to do this. My Robot class is able to make the appropriate API calls and updates state with every API call. Certain methods in my class return the data from the API call when necessary. I kept my Robot class minimal and did not want to crowd it with a ton of private methods. I pulled a lot of these helper methods into their own python files to make things a bit more modular.

My main algorithm consists of the following process:
1) Register the robot
2) Scan my immediate surrounding
3) Loop through all nodes in the vicinity that we either claimed already or is not claimed by anyone else and claim that node. Mine that particular node to exhaustion before doing anything else.
4) Keep going in the loop if there are more nodes to mine or there is a conflict in mining
5) Move the robot to an area where we can scan the most area to hopefully mind the most nodes to mine
6) Repeat steps 2-6

I wrote some tests to unit test my helper methods.

## Tradeoffs

I decided to focus on code hygiene, architecture and documentation above having the perfect algorithm, since the criteria weighted these categories pretty highly. I would have loved to improve my algorithm for moving around the grid a bit more, but ran out of time. If I could incorporate future changes, this is what I would add:
  1) Incorporate nodes founds in the scan into the moving algorithm, i.e. go towards where there are mining nodes
  2) Extensibility to account for non rectangular search areas, i.e. if the /scan api allowed more flexibility

## If I had more time

It was hard to account for "Failure" from the API because I couldn't actually get it to fail too often, so I did pretty minimal error handling. If I had more time, I would have penetrated the API a bit more for failure. I was also toying with the idea of having a decorator to wrap around the post request to retry requests incase of errors.

I would have also liked to write more tests, especially against the API (Integration Tests), but simply just ran out of time.

## Dependencies

Added the following dependencies:
1) requests: standard library for making http requests

You can install dependencies using the *required* `setup.sh` script.

## Running my submission

You can run my submission using the *required* `start.sh` script.

As you'll see, it checks for the existence of two environment variables:
* `SERVER_HOST`
* `SERVER_PORT`

and if those aren't already environment variables, sets them to the tournament test server.
