# Start Command

## `RunStrategy`

The `RunStrategy` is an interface that defines a strategy to run the application.

Strategies are used to separate the logic of running the application from the command itself.

They are used to keep the command simple and to make it easy to extend the command with new strategies.

Strategies can call other strategies, e.g., to run the application in a browser, the `BrowserRun` strategy calls the `FrontendServe` strategy to start the frontend server.
