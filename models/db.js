const mongodb = require('mongodb');

const client = mongodb.MongoClient;

//URL OF THE DATABASE
// const uri = "mongodb+srv://user:pass1234@database-ourwj.mongodb.net/test?retryWrites=true&w=majority";
// const url = `mongodb://localhost:27017`;
const url = `mongodb://user:pass123@database-shard-00-00-ourwj.mongodb.net:27017,database-shard-00-01-ourwj.mongodb.net:27017,database-shard-00-02-ourwj.mongodb.net:27017/test?ssl=true&replicaSet=Database-shard-0&authSource=admin&retryWrites=true&w=majority`;
const options = { useUnifiedTopology: true, useNewUrlParser: true};

const dbName = 'HotelParaiso';
// const dbName = 'test';

const database = {

    // creates database
    createDatabase: function() {
        client.connect(url, options, function(err, db) {
            if (err) throw err;
            // console.log('Database created!');
            // db.close();
        });
    },

    createCollection: function(collection) {
        client.connect(url, options, function(err, db) {
            if (err) throw err;
            var database = db.db(dbName);
            database.createCollection(collection, function(err, res) {
                if (err) throw err;
                // console.log('Collection ' + collection + ' created');
                // db.close();
            });
        });
    },

    insertOne: function(collection, doc, callback) {
        client.connect(url, options, function(err, db) {
            if (err) throw err;
            var database = db.db(dbName);
            database.collection(collection).insertOne(doc, function(err, res) {
                if (err) throw err;
                // console.log('1 document inserted');
                // db.close();
                return callback(res);
            });
        });
    },

    insertMany: function(collection, docs, callback) {
        client.connect(url, options, function(err, db) {
            if (err) throw err;
            var database = db.db(dbName);
            database.collection(collection).insertMany(docs, function(err, res) {
                if (err) throw err;
                // console.log('Documents inserted: ' + res.insertedCount);
                // db.close();
                return callback(res);
            });
        });
    },

    // TODO: try db error thing 
    findOne: function(collection, query, callback) {
        client.connect(url, options, function(err, db) {
            if (err) throw err; //return "error" 
            var database = db.db(dbName);
            database.collection(collection).findOne(query, function(err, result) {
                if (err) throw err;
                // db.close();
                return callback(result);
            });
        });
    },

    findMany: function(collection, query, sort = null, projection = null, callback) {
        client.connect(url, options, function(err, db) {
            if (err) throw err;
            var database = db.db(dbName);
            database.collection(collection).find(query, { projection: projection })
                .sort(sort).toArray(function(err, result) {
                    if (err) throw err;
                    // db.close();
                    return callback(result);
                });
        });
    },

    // deletes a single document in the collection `collection`
    // based on the object `filter`
    deleteOne: function(collection, filter, callback) {
        client.connect(url, options, function(err, db) {
            if (err) throw err;
            var database = db.db(dbName);
            database.collection(collection).deleteOne(filter, function(err, res) {
                if (err) throw err;
                // console.log('1 document deleted');
                // db.close();
                return callback(res);
            });
        });
    },

    // deletes multiple documents in the collection `collection`
    // based on the object `filter`
    deleteMany: function(collection, filter, callback) {
        client.connect(url, options, function(err, db) {
            if (err) throw err;
            var database = db.db(dbName);
            database.collection(collection).deleteMany(filter, function(err, res) {
                if (err) throw err;
                // console.log('Documents deleted: ' + res.deletedCount);
                // db.close();
                return callback(res);
            });
        });
    },

    // drops the collection `collection`
    dropCollection: function(collection) {
        client.connect(url, options, function(err, db) {
            if (err) throw err;
            var database = db.db(dbName);
            database.collection(collection).drop(function(err, res) {
                if (err) throw err;
                // console.log('Collection ' + collection + ' deleted');
                // db.close();
            });
        });
    },


    updateOne: function(collection, filter, update, callback) {
        client.connect(url, options, function(err, db) {
            if (err) throw err;
            var database = db.db(dbName);
            database.collection(collection).updateOne(filter, update, function(err, res) {
                if (err) throw err;
                // console.log('1 document updated');
                // db.close();
                return callback(res);
            });
        });
    },


    updateMany: function(collection, filter, update, callback) {
        client.connect(url, options, function(err, db) {
            if (err) throw err;
            var database = db.db(dbName);
            database.collection(collection).updateMany(filter, update, function(err, res) {
                if (err) throw err;
                // console.log('Documents updated: ' + res.modifiedCount);
                // db.close();
                return callback(res);
            });
        });
    }
}

module.exports = database;