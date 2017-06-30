var MongoClientConnecyAsync = (url) => new Promise((resolve, reject) => {
  //passing in a url b/c url is hardcoded above (above: url = "http://..")
  //
    MongoClient.connect(url, function(err, db) {
      if(err){
        reject(err)
      }
      resolve(db);
})

MongoClientConnecyAsync(url).then(db => {
  //by doing (url), we're making this a new function that takes in url
  console.log("Successfully Connected to server")
  db.close()
}).catch(console.log) //catching errors
