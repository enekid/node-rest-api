# Endpoints

* should return something when calling /api
    * GET http://rest-api.dev:7000/api
* should create a note
    * POST http://rest-api.dev:7000/api/notes -> ({text: "mytext"})
* should get all the notes
    * GET http://rest-api.dev:7000/api/notes
* should get a note by id
    * GET http://rest-api.dev:7000/api/notes/<note-id>
* should mark a note as favorite
    * POST http://rest-api.dev:7000/api/notes/<note-id>/favorite
* should get all notes marked as favorite
    * GET http://rest-api.dev:7000/api/notes/favorite

You have a postman collection available in /doc


# Install

## Client

Add to `hosts` file

`127.0.0.1 rest-api.dev`

## Create Docker containers

Build and run the docker containers (nodejs and mongodb)

`docker-compose up`


## Install Node Api Server

In a new terminal run a nodjs container:

`docker run -it -v /home/eneko/workspace/kubide/server-api:/server-api node:0.12 /bin/bash`

Install all the npm dependencies:

`npm install`


## Install MongoDB

In a new terminal attach to the mongodb container:

`docker exec -it mongodb mongo`

Fix error with authSchema in mongodb ([Stackoverflow](http://stackoverflow.com/questions/29006887/mongodb-cr-authentication-failed)):

```
mongo
use admin
db.system.users.remove({})
db.system.version.remove({})
db.system.version.insert({ "_id" : "authSchema", "currentVersion" : 3 })`
```

Restart containers:

```
Ctrl+c
docker-compose up
```

In a new terminal reattach to the mongodb container:

`docker exec -it mongodb mongo`

Create mongodb user:

```
use restdb

db.notes.insert({text:'hello kubide'});

db.createUser( {
    "user" : "mongo",
    "pwd" : "mongo",
    "roles": [
        { "role": "readWrite", "db": "restdb" }
    ]
});
```
Shut down containers:

`Ctrl+c`


# Run Rest Api

Start containers:

`docker-compose up`

Now you can access all the endpoints
