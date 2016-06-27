var mongoose = require('mongoose');

// Create a connect.js inside the models/ directory that
// exports your MongoDB URI!
var connect = require('./connect');
var Schema = mongoose.Schema;

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);

var models = {
	
	restaurants : mongoose.model('Restuarant', {
		name: String,
		menu: [{
			name: String,
			price: Number,
			ingredients: []
		}
		]
		
})
	
}

module.exports = models;