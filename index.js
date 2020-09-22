const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {useUnifiedTopology: true, useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  thoughts: [{ id: String, date: Date }],
  friends: [{ id: String }],
  friendCount: Number
});


const thoughtsSchema = new mongoose.Schema({
  thoughtText: String,
  createdAt: { type: Date, default: Date.now },
});



const reactionsSchema = new mongoose.Schema({
  username: String,
  createdAt: { type: Date, default: Date.now },
});
