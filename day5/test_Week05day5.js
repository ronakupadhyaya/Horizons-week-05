var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

for (var i = 0; i < array.length; i++) {
  array[i]
}
// Connection URL
var url = 'mongodb://rick:abcde@ds139899.mlab.com:39899/rick-test';

// Use connect method to connect to the server
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
//   db.close();
// });

// Define a new promise and put the function you want to work inside the promise
var MongoClientConnectAsync = (url) => new Promise((resolve,reject)=>{
  // Attention! new way of pass in url, wrap it in a function
  // Either resolve or reject would be called, can't both be called
  MongoClient.connect(url, function(err, db) {
    if(err){
      reject(err)
    }
    resolve(db);
  });
})

MongoClientConnectAsync.then(db => {
  console.log("Connected successfully");
  db.close()
}).catch(console.log)  // log the err in the if statement before
