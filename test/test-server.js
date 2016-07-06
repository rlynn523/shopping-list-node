var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server.js");

var should = chai.should();
/* Created app and storage variables, whcih allow us to make requests to the app
and investigate the current state of the storage object */
var app = server.app;
var storage = server.storage;
/* Tells Chai to use the Chai HTTP plugin, which allows you to make HTTP
requests and check that the responses we recieve are correct*/
chai.use(chaiHttp);

describe("Shopping List", function() {
/* A new function is passes as a second argument to it; the function will
contain your test code. It takes a single argument called done. This is a
function which you call to tell Mocha that the test has completed */
it("should list items on GET", function(done) {
    /* Call the chai.request function telling Chai HTTP to make a request
    to your app */
    chai.request(app)
        // Call the get method to make a get request to the /items endpoint.
        .get("/items")
        /* Call the .end method, which runs the function which you pass in
        when the request is complete. */
        .end(function(err, res) {
            should.equal(err, null);
            /* An example of a should style assertion. Here you say that
            the response should have a 200 status code. */
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("array");
            res.body.should.have.length(3);
            // Testing to see if the index has the correct properties/values
            res.body[0].should.be.a("object");
            res.body[0].should.have.property("id");
            res.body[0].should.have.property("name");
            res.body[0].id.should.be.a("number");
            res.body[0].name.should.be.a("string");
            res.body[0].name.should.equal("Broad beans");
            res.body[1].name.should.equal("Tomatoes");
            res.body[2].name.should.equal("Peppers");
            done();
        });
});
it("should add an item on POST", function(done) {
    chai.request(app)
        .post("/items")
        .send({
            "name": "Kale"
        })
        .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.should.have.property("name");
            res.body.should.have.property("id");
            res.body.name.should.be.a("string");
            res.body.id.should.be.a("number");
            res.body.name.should.equal("Kale");
            storage.items.should.be.a("array");
            storage.items.should.have.length(4);
            storage.items[3].should.be.a("object");
            storage.items[3].should.have.property("id");
            storage.items[3].should.have.property("name");
            storage.items[3].id.should.be.a("number");
            storage.items[3].name.should.be.a("string");
            storage.items[3].name.should.equal("Kale");
            done();
        });
});
it("should edit an item on PUT", function(done) {
    chai.request(app)
        .put("/items/" + 0)
        .send({
            "name": "Black Beans"
        })
        .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(200);
            res.should.be.equal.json;
            res.body.should.be.a("object");
            res.body.should.have.property("name");
            res.body.should.have.property("id");
            res.body.name.should.be.a("string");
            res.body.id.should.be.a("number");
            res.body.name.should.equal("Black Beans");
            res.body.id.should.equal(0);
            done();
        });
});
it("should delete an item on DELETE", function(done) {
    chai.request(app)
        .delete("/items/" + 1)
        .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.should.have.property("name");
            res.body.should.have.property("id");
            res.body.name.should.be.a("string");
            res.body.id.should.be.a("number");
            res.body.name.should.equal("Tomatoes");
            res.body.id.should.equal(1);
            done();
        });
});
});
