# [ Learn MVC Pattern with ExpressJS and NodeJS - Tutorial Begginer ](https://www.youtube.com/watch?v=Cgvopu9zg8Y)

This example uses an api, which is very convenient for my purposes. The idea is that the controller is entry point for requests, it will then use functions defined in the controller to make the model do something, e.g. get a value fitting some contraint. The view will then determine what will be done with the result, in the case of an API, this will be something like serializing and jsonifying the models.

# This Project

The goal is to have a library of queries which may be used by the controller as the model. I like this idea since I don't like rewriting queries throughout various repsonses. The controller will use these queries for response logic and the response itself. The view section will have a decorator to be applied to every controller, since composition of functions is roughly the situation here this still adheres to the functional principals in the MVC pattern.
