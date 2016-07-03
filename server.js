// Include the Express module
var express = require("express");
/* Require the body-parser module. body-parser gathers teh body data as it is
streamed from the client, and then parses it according to its data type */
var bodyParser = require("body-parser");
// Create a JSON parser
var jsonParser = bodyParser.json();
// Create a simple object called Storage for storing and managing list items
var Storage = function(){
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name){
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};
Storage.prototype.delete = function(id){
    var myStorage = this;
    var myDeletedItem;
    this.items.forEach(function(item, i){
        if(id == item.id){
            myStorage.items.splice(i,1);
            myDeletedItem = item;
        }
    });
    return myDeletedItem;
};
Storage.prototype.put = function(name, id){
    var myStorage = this;
    var newItem =  {name: name, id: id};
    this.items.forEach(function(item, i){
        if(id == item.id){
            myStorage.items[i] = newItem;
        }
    });
    return newItem;
};
var storage = new Storage();
// Static list of three items
storage.add("Broad beans");
storage.add("Tomatoes");
storage.add("Peppers");
// Create app object and tell it to use the express.static middleware
// This tells express to serve any static content contained in the public folder
var app = express();
app.use(express.static("public"));
// Have a single route for get requests to the /items URL
// In the route you return the storage.items list as JSON
app.get("/items", function(req, res){
    res.json(storage.items);
});
/* The second argument to the post method is jsonParser. This tells express to
use the jsonParser middleware when requests for the route are made. */
app.post("/items", jsonParser, function(req, res){
/* The middleware adds new attribute req.body to the request object. If there is
no body or the body is not correctly formatted JSON, the body attribute is
undefined. */
    if(!req.body) {
// res.sendStatus indicates a 400 Bad Request
        return res.sendStatus(400);
    }
/* If body exits, the you add the item to the shopping list, and return a
201 Created status, along with the item */
    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete("/items/:item_id", function(req, res){
    var id = req.params.item_id;
    var deletedItem = storage.delete(id);
    if(deletedItem){
        res.status(200).json(deletedItem);
    } else {
        res.sendStatus(404);
    }
});

app.put("/items/:item_id", jsonParser, function(req, res){
    var id = req.params.item_id;
    var name = req.body.name;
    var updatedItem = storage.put(name, id);
    if(updatedItem){
        res.status(200).json(updatedItem);
    } else {
        res.sendStatus(404);
    }
});
/* Tell the app to listen for requsts on a port which defaults to 8080 but can
be configured using an environment variable */
app.listen(process.env.PORT || 8080);
