I wrote my submission in elm. The project can be run locally by following the steps below:
1. Download elm 0.19.0
2. Install node dependencies
3. Run `npm run build`
4. Run `npm start` and go to `localhost:3000`

Major logic is contained in src/Main.elm with separate files created for entities like Bot, Node, Location, and Grid. Due to the limited time, I was not able to style the dashboard, but I created a 20x20 grid that fetches the nodes and bot data every second and renders the movement of the bots with a robot emoji as well as the value of each node. When a bot emoji is clicked, it also renders the ID and score of the bot below the grid. The grid size can easily be changed by changing the initial values of `rows` and `columns` in the `initModel` of src/Main.elm.

The files are ready to be deployed and will run automatically in production build when pushed to heroku.
