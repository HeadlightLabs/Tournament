# MarsChallenge

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## My approach

I used Angular and Rxjs to create my Mars mining monitor application.

The main components that make up my architecture is the dashboard component, which fetches data on the bots and nodes at periodic interval from the back-end API, the grid, which is responsible for rendering the mining data to the UI, and the grid-cell, which displays data for a particular cell. 

I attempted to make my grid component generic - its size is configurable, allowing different sized environments to be displayed. On each periodic refresh, the grid is re-rendered.
