var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.
var port = process.env.API_PORT || 3000;

var server = supertest.agent("http://api-server:" + port + '/api');


//connect to database
var mongoose   = require('mongoose');

var Note     = require('../app/models/note');


//helper functions
function seedDb() {
  var notes = [
    new Note({text:'text1'}),
    new Note({text:'text2'}),
    new Note({text:'text3'}),
    new Note({text:'text4'}),
    new Note({text:'text5'}),
    new Note({text:'text6'})
  ];

  notes.forEach(function(note) {
    note.save(function(err) {
          if (err)
              console.log(err);       
        });
  });
}

function seedDbWithFavorites() {
  var notes = [
    new Note({text:'text1'}),
    new Note({text:'text2', favorite:true}),
    new Note({text:'text3'}),
    new Note({text:'text4'}),
    new Note({text:'text5', favorite:true}),
    new Note({text:'text6'})
  ];

  notes.forEach(function(note) {
    note.save(function(err) {
          if (err)
              console.log(err);       
        });
  });
}

// INTEGRATION tests begin

describe("Rest integration tests",function(){

  before(function(done) {
    mongoose.connect('mongodb://' + process.env.MONGODB_USERNAME + ':' + process.env.MONGODB_PASSWORD + '@mongodb:' + process.env.MONGODB_PORT + '/restdb',
      function(err) {
        if (err) {
          console.log('Error: ' + err);
        }
        done();
    });
  });

  beforeEach(function(done) {
    Note.remove({}, function (err) {
      if (err) {
        console.log('Error: ' + err);
      }
      done();
    });
  });

  after(function(done) {
    Note.remove({}, function (err) {
      if (err) {
        console.log('Error: ' + err);
      }
      done();
    });
  });


  // #1 should return something

  it("should return something when calling /api",function(done)
  {
    // calling home page api
    server
    .get("/")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.statusCode.should.equal(200);
      done();
    });
  });


  // #2 should create a note

  it("should create a note",function(done)
  {
    server
    .post("/notes")
    .send({text : 'text'})
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.message.should.equal('Note created');
      Note.findOne({text: 'text'}).exec(function(err, note){
        should.exist(note);
        done();
      });

    });
  });


  // #3 should get all the notes

  it("should get all the notes",function(done)
  {
    seedDb();

    server
    .get("/notes")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.length.should.equal(6);
      done();
    });
  });


  // #4 should get a note by id

  it("should get a note by id",function(done)
  {
    var note = new Note({text:'text'});

    note.save(function(err, note) {
      if (err)
          console.log(err);   

      server
        .get("/notes/" + note._id.toString())
        .expect("Content-type",/json/)
        .expect(200) // THis is HTTP response
        .end(function(err,res){
          res.status.should.equal(200);
          res.body._id.should.equal(note._id.toString());
          done()
      });    
    });
  });


  // #5 should mark a note as favorite

  it("should mark a note as favorite",function(done)
  {
    var note = new Note({text:'text'});

    note.save(function(err, note) {
      should.not.exist(err); 

      server
        .post("/notes/" + note._id.toString() + '/favorite')
        .expect("Content-type",/json/)
        .expect(200) // THis is HTTP response
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.message.should.equal('Note marked as favorite!');
          Note.findById(note._id).exec(function(err, note){
            note.favorite.should.be.true;
            done();
          });
        });    
    });
  });


  // #6 should get all notes marked as favorite

  it("should get all notes marked as favorite",function(done)
  {
    seedDbWithFavorites();   

    server
    .get("/notes/favorite")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.length.should.equal(2);
      done();
    });  
  });

});