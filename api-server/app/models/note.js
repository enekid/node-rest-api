var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var NoteSchema   = new Schema({
    text: String,
    favorite: Boolean
});

module.exports = mongoose.model('Note', NoteSchema);
