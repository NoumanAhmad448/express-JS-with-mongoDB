const { MongoClient, ServerApiVersion} = require('mongodb');
require("dotenv").config();
const express = require("express"); 
const objectID = require('mongodb').ObjectID;

let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const port = process.env.PORT
const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.get('/', function(req,res){
   
    client.connect(err => {
    const collection = client.db("sample_airbnb").collection("listingsAndReviews");
    collection.find({}).limit(5).toArray(function(err,result){
        if(err){
            res.status(400).json({err: 'no data found'})
        }
        let total_rec = result.length;
        res.json({total_rec: total_rec, result: result});
    });

});
})

app.post('/punch-data', function(req,res){
    client.connect(err => {
        if(err){
            res.json({err: err});
        }
        const comments = client.db("sample_mflix").collection("comments");
        let userInput = {
            name: "Nouman Ahmad" ?? '', 
            email : "nouman.test@test.com" ?? '', 
            comments: "this is simple test" ?? '', 
            date: new Date(Date.now()) ?? new Date(),
        }

        comments.insertOne(userInput);
    
        res.json({msg: "document has been inserted successfully"});    
    });
});


app.post('/get-latest-record', function(req,res){
    client.connect(err => {
        if(err){
            res.json({err: err});
        }
        const comments = client.db("sample_mflix").collection("comments");
        comments.find().sort({_id : -1}).limit(1).toArray(function(err,result){
            res.json(result);    
        });
    
    });
});

app.post('/update-comment', function(req,res){
    
    client.connect(err => {
        if(err){
            res.json({err: err});
        }
        const comments = client.db("sample_mflix").collection("comments");
        comments.updateOne({_id: req.body.id},{
            $set : {
                email: req.body.email
            }
        });

        res.json({
            msg: "record has been updated successfully",
        });
    
    });
});


app.post('/get-document', function(req,res){
    
    client.connect(err => {
        if(err){
            res.json({err: err});
        }
        const comments = client.db("sample_mflix").collection("comments");
        comments.findOne({ email: req.body.email  },     
            function(err,response){
            if(err){
                res.json({
                    err: err
                });
            }
            res.json(response)
        });        
    
    });
});


app.post('/get-document-by-id', function(req,res){
    
    client.connect(err => {
        if(err){
            res.json({err: err});
        }
        const comments = client.db("sample_mflix").collection("comments");
        comments.findOne({ _id: objectID(req.body.id)  },     
            function(err,response){
            if(err){
                res.json({
                    err: err
                });
            }
            res.json(response)
        });        
    
    });
});

app.delete('/remove-document-by-id', function(req,res){
    
    client.connect(err => {
        if(err){
            res.status(400).json({err: err});
        }
        const comments = client.db("sample_mflix").collection("comments");
        comments.deleteOne({ _id: objectID(req.body.id)  },     
            function(err,response){
            if(err){
                res.status(400).json({
                    err: err
                });
            }
            res.json({msg: "document has been deleted successfully"})
        });        
    
    });
});

app.post('/insert-many-docs', function(req,res){
    client.connect(err => {
        if(err){
            res.status(400).json({err: err});
        }
        const comments = client.db("sample_mflix").collection("comments");
        comments.insertMany(req.body,     
            function(err,response){
            if(err){
                res.status(400).json({
                    err: err
                });
            }            
            res.json({msg: "All documents have been inserted successfully", ids: response.insertedIds})
        });        
    
    });
});



app.listen(port , () => {
    console.log(`server is running at ${port}`)
})