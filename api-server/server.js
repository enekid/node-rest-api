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


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


app.listen(port);
console.log('Api Server started on port ' + port);