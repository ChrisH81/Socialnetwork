var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

const bodyParser = require('body-parser');
const parser = bodyParser.urlencoded({ extended: false })
mongoose.connect('mongodb://localhost/test', {useUnifiedTopology: true, useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

});

const thoughtsSchema = new mongoose.Schema({
  thoughtText: String,
  createdAt: { type: Date, default: Date.now },
});


/* GET thoughts listing. */
router.get('/', function(req, res, next) {
  const Thought = mongoose.model('Thought', thoughtsSchema);
  Thought.find({}, function(err, thoughts) {
    var thoughtMap = {};

    thoughts.forEach(function(thought) {
      thoughtMap[thought._id] = thought;
    });

    res.send(thoughtMap);  
  });
});	

router.get('/:id', function(req, res, next) {
  const Thought = mongoose.model('Thought', thoughtsSchema);
  var id = req.params.id;
  Thought.findById(id, function (err, thought) { 
	res.send(thought);  
  });
});

router.put('/:id', function(req, res, next) {
  const Thought = mongoose.model('Thought', thoughtsSchema);
  if (req.body.friend) {
	  Thought.find(req.params.id).friends.push(req.body.friend);
  	  res.send("friend added");
  }
});

router.delete('/:id', function(req, res, next) {
  const Thought = mongoose.model('Thought', thoughtsSchema);
  Thought.find({ id: req.params.id}).remove().exec();
  res.send("thought deleted");  
});


/* post new thought */
router.post('/', parser, (req, res) => {
	console.log("posted");	

	const Thought = mongoose.model('Thought', thoughtsSchema);

	if (req.body.thoughtText) {
		Thought.create({ thoughtText: req.body.thoughtText }, function (err, small) {
		  if (err) return handleError(err);
		});
		
		res.send("thought created");
	}

});
module.exports = router;
