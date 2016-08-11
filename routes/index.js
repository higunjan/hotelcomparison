var mongo = require('mongodb'),
    BSON = mongo.BSONPure,
    request = require('request'),
    assert = require('assert');

exports.login = function (req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    console.log('req----------------',req.body, req.method)
    if (req.method == 'POST') {
        username = req.body.username;
        password = req.body.password;
    }
    console.log(username, password)
    if((username == "admin" || username == "admin@gmail.com") && password == "helloworld"){
        res.send({status:1, message: "Login successful"})
    }else{
        res.send({status:0, message: "Login fail, username & password are wrong please check"})
    }
}


//API insert/update/delete
exports.saveApi = function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var query = URI = operation = collectionModel = null;
    var option = {}, insertData = {}, fieldOption = {},inputval = {},mesagetext=[];
    sortOption = {_id: -1};
    if (req.method == 'POST') {
        query = req.body;
    } else {
        URI = decodeURIComponent(req.url);
        var queryString = URI.substring(URI.indexOf('?') + 1);
        query = parseQueryString(queryString);
    }

    query = toLowerQueryParam(query);
    var opt = query.option || null,
        id = query.id || null,
        collectionName = query.table.toString().toLowerCase(),
        limit = query.limit || null,
        operation = query.action,
        paramater = inputval =  query;
    delete paramater['action'];
    delete paramater['table'];
    var timestamp = new Date().toISOString();

    //INITAIL CONDITION TO CHECK TABLE NAME
    try {
        if (collectionName == 'ads') {
            collectionName == collectionName;
            smsreceiveapi();
        }
        else {
            res.send({"Result": "Wrong tablename", "status": "0"});
        }
    }
    catch (e) {
        console.log(e);
    }

    // INSERT / UPDATE / DELETE / RETRIVE CASE FUNCTION
    function smsreceiveapi() {
        switch (operation.toString().toLowerCase()) {
            case 'insert':
                console.log("\n ========== Insert Option ========= \n ");
                try {
                    insertIntoDB(collectionName, option, function (results) {
                        if (results.length > 0) {
                            res.json(results);
                        } else {
                            res.json({
                                "success": "0"
                            });
                        }
                    });
                }
                catch (e) {
                    res.send(e);
                }
                break;

            case 'retrive':
                try {
                    console.log('+++option++', option)
                    findIntoSingleDB(collectionName, option, function (results) {
                        console.log(results)
                        if (results.length > 0) {
                            res.json(results);
                        } else {
                            res.json({
                                "success": "0"
                            });
                        }
                    });
                }
                catch (e) {
                    res.send(e);
                }
                break;
            case 'update':
                console.log("\n ========== Update Option ========= \n ",insertData);
                break;
            case 'delete':
                var table = collectionModel.modelName;
                try {
                }catch (e) {
                    res.send(e);
                }
                break;
            default:
                res.send({"result": "Wrong action", "status": "0"});
        }
    }
};

//CONVERT INTO LOWERCASE
var toLowerQueryParam = function (query) {
    var Query = {};
    for (var key in query) {
        Query[key.toLowerCase()] = query[key];
    }
    return Query;
}

//INSERT QUERY
function insertIntoDB(Collection, option, callback) {
    hotelcomp_db.collection(Collection).insertMany([
            {clickCount : 1, adsType:'homepage', numberOfAds : 3, descriptions: "HotelAds"}, {clickCount : 2, adsType:'homepage', numberOfAds : 8, descriptions: "HotelAds"}, {clickCount : 3, adsType:'homepage', numberOfAds : 8, descriptions: "HotelAds"}
        ], function(err, result) {
            assert.equal(err, null);
            assert.equal(3, result.result.n);
            assert.equal(3, result.ops.length);
            console.log("Inserted 3 documents into the document collection");
            callback(result);
    });
    /*sms_db.collection(Collection, {safe: true}, function (err, collection) {
        if (err) {
            console.log(err);
            callback(null);
        } else {
            collection.insert(option, {safe: true}, function (err, result) {
                if (err || !result) {
                    console.log(err);
                    callback(null);
                } else {
                    callback(result);
                }
            });
        }
    });*/
};

//RETRIEVE QUERY
var findIntoSingleDB = function (Collection, opt, callback) {
    var collection = hotelcomp_db.collection('ads')
    collection.find({}).toArray(function(err, docs) {
        console.log(err, docs)
        assert.equal(err, null);
        assert.equal(2, docs.length);
        console.log("Found the following records");
        console.dir(docs);
        callback(docs);
    });
};

//UPDATE QUERY
function updateIntoDB(collectionName, query, setQuery, boolOpt, callback) {
    if (isEmptyObject(boolOpt)) {
        boolOpt = {safe: true, upsert: false, multi: false};
    }
    if (isEmptyObject(setQuery)) {
        callback(0);
        return;
    }
    hotelcomp_db.collection(collectionName, {safe: true}, function (err, collection) {
        if (err) {
            console.log(err);
            callback(0);
        } else {
            collection.update(query, setQuery, boolOpt, function (err, res) {
                if (err) {
                    console.log("Update Query Error : ", err);
                    callback(0);
                } else {
                    callback(res);
                }
            });
        }
    });
};


//DELETE QUERY
function removeFromDB(collectionName, query, callback) {
    sms_db.collection(collectionName, {safe: true}, function (err, collection) {
        collection.remove(query, function (err, result) {
            if (err) {
                console.log(err, result);
                callback(result);
            } else {
                console.log(result + " row deleted.");
                callback(result);
            }
        });
    });
};

//PARSE QUERY PARAMETER
var parseQueryString = function (queryString) {
    var params = {}, queries, temp, i, l;

    // Split into key/value pairs
    queries = queryString.split("&");

    // Convert the array of strings into an object
    for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
};