/* ========================== mongo db connection - start =================================== */
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

GLOBAL.hotelcomp_db = undefined;
// Connection URL 
var url = 'mongodb://hotelcomp:123456@ds153745.mlab.com:53745/hotelcomp';

// Use connect method to connect to the Server 
function connectMongoLab(ip, callback) {
    MongoClient.connect(ip, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        if (!err && db) {
            hotelcomp_db = db;
            // console.log("hotelcomp", db.databaseName, db.serverConfig.host, db.serverConfig.port);
            callback(true);
        } else {
            console.log(err, db);
            callback(false);
        }
        db.close();
    });
};

connectMongoLab(url, function (flag) {
    if (flag == false) {
        console.log("mongodb connection with DB Farm... fail");
    } else {
        console.log("mongodb connection with DB Farm.....success");
    }
});
/* ========================== mongo db connection - end =================================== */