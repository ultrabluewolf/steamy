# Steamy

This app interacts with the [Steam API][Steam] to display data about Users and Games.

## Setup

Ensure you have [node.js] installed. Then run the following in the command line:

    npm install -g gulp

To install the local dependencies:

    npm install
    bower install

### Building Assets
In one tab run:

    gulp build

### Running the App
And in another:

    npm start

Note: for the app to communicate with Steam's API locally you will need to create a `config/secret` file that contains your Steam api key. (See `config/secret.sample` for guidance.)

### Running the Tests

    npm test

[steam]: http://steamcommunity.com/dev
[node.js]: https://nodejs.org/
