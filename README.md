## My Approach

Hi - I had a lot of fun with this challenge - so thanks again for reaching out!

I structured this as a ReactJS application with a basic Flux architecture.

For the visualization, I chose to use SVG as I've been wanting to get better with SVG for web based data viz.  This seemed like a great opportunity to try.

The data will refresh every 1 second - and the SVG will re-render.

The bots are red dots, the nodes are gray dots.

The bots are shown with current score, and the nodes are shown with current value.

A green line will connect a Bot to all of the nodes it currently has a claim on.

If I were to spend more time on this, I would try to add 

    Animations on the SVG
    Tooltips to show more contextual information on hover for each of the bots or nodes
    Outside of the SVG - it would be nice to see all of the information in tabular form
        For example - a simple leaderboard table would have been nice to have at the bottom


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

