var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.API_PORT || 3000;

//connect to database
var mongoose   = require('mongoose');
mongoose.connect('mongodb://' + process.env.MONGODB_USERNAME + ':' + process.env.MONGODB_PASSWORD + '@mongodb:' + process.env.MONGODB_PORT + '/restdb',
	function(err) {
    console.log(err);
});

var Note     = require('./app/models/note');



// ROUTES
// =============================================================================
var router = express.Router();       

// test route http://domain:port/api
router.get('/', function(req, res) {
    res.json({ message: 'Api server up&running' });   
});

// Notes routes

router.route('/notes/favorite')

    // get the notes marked as favorite (accessed at GET http://domain:port/api/notes/favorite)
    .get(function(req, res) {
        Note.find({ favorite:true }, function(err, notes) {
            if (err)
                res.status(500).send(err);

            res.json(notes);
        });
    }); 

router.route('/notes')

    // create a note (accessed at POST http://domain:port/api/notes)
    .post(function(req, res) {
        var note = new Note();      // create a new instance of the note model
        note.text = req.body.text;  // set the notes name (comes from the request)

        // save the note and check for errors
        note.save(function(err) {
            if (err)
                res.status(500).send(err);

            res.json({ message: 'Note created' });
        });
        
    })
    
    // get all the notes (accessed at GET http://domain:port/api/notes)
    .get(function(req, res) {
        Note.find(function(err, notes) {
            if (err)
                res.status(500).send(err);

            res.json(notes);
        });
    });

router.route('/notes/:note_id')

    // get the note with that id (accessed at GET http://domain:port/api/notes/:note_id)
    .get(function(req, res) {
        Note.findById(req.params.note_id, function(err, note) {
            if (err)
                res.status(404).send('Not found');
            res.json(note);
        });
    });

router.route('/notes/:note_id/favorite')

    // get the note with that id (accessed at POST http://domain:port/api/notes/:note_id/favorite)
    .post(function(req, res) {
        Note.findById(req.params.note_id, function(err, note) {
            if (err)
                res.status(404).send('Not found');
            
            note.favorite = true;
            note.save(function(err) {
                if (err)
                    res.status(500).send(err);

                res.json({ message: 'Note marked as favorite!' });
            });
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


app.listen(port);
console.log('Api Server started on port ' + port);