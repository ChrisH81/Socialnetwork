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

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  thoughts: [{ id: String, date: Date }],
  friends: [{ id: String }],
  friendCount: Number
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  const User = mongoose.model('User', userSchema);
  User.find({}, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });

    res.send(userMap);  
  });
});

router.get('/:id', function(req, res, next) {
  const User = mongoose.model('User', userSchema);
  var id = req.params.id;
  User.findById(id, function (err, user) { 
	res.send(user);  
  });
});

router.put('/:id', function(req, res, next) {
  const User = mongoose.model('User', userSchema);
  console.log(req.params.id);
  if (req.body.friend) {
  	if (User.find(req.params.id).friends) {
	  User.find(req.params.id).friends.push(req.body.friend);
  	  }
  	  res.send("friend added");
  }
});

router.delete('/:id', function(req, res, next) {
  const User = mongoose.model('User', userSchema);
  console.log(req.params.id);
  User.find({ id: req.params.id}).remove().exec();
  res.send("user deleted");  
});


/* post new user */
router.post('/', parser, (req, res) => {
	console.log("posted");	

	const User = mongoose.model('User', userSchema);

	if (req.body.username && req.body.email) {
		User.create({ username: req.body.username, email: req.body.email }, function (err, small) {
		  if (err) return handleError(err);
		});
		
		res.send("user created");

	}
	res.send({"endOfFunction": true});

});

module.exports = router;
