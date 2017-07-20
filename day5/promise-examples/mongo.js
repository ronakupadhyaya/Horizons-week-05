var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://rick:abcde@ds139899.mlab.com:39899/rick-test';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  db.close();
});

var MongoClientConnectAsync = (url) => new Promise((resolve, reject) => {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      reject(err);
    } else {
      resolve(db);
    }
  })
})

MongoClientConnectAsync(url).then((db) => {
  console.log("Connected successfully to server2");
  db.close();
})
