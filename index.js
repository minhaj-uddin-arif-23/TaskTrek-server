// const express = require("express")
// const app = express()
require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 8000
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wclmi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const Database = client.db("Task-Trek")
    const taskCollection = Database.collection("Task")

    app.post("/addTask",async(req,res)=>{
      const data =req.body
      const result = await taskCollection.insertOne(data)
      res.send(result)

    })

    app.get('/showTask',async(req,res)=>{
      const filter = req.query.filter
      let query = {}
      if(filter) query.status = filter
      const result = await taskCollection.find(query).toArray()
      res.send(result)
    })

    // single data
    // app.get("/updateTask/:id",async (req,res) => {
    //   const id = req.params.id
    //   const query = {_id : new ObjectId(id)}
    //   const result = await taskCollection.findOne(query);
    //   res.send(result)
    // })

    app.patch("/updateTask/:id",async(req,res)=>{
      const id =req.params.id;
      const query = {_id:new ObjectId(id)}
      const updateTask = req.body;
      const task = {
        $set : {
          title : updateTask.title, 
          details : updateTask.details,
          status : updateTask.status,
          // time: updateTask.time
        }
      };
      const result = await taskCollection.updateOne(query,task)
      res.send(result)
    })

    app.delete("/taskdelete/:id",async(req,res) => {
      const singleTask = req.params.id
      const query = {_id : new ObjectId(singleTask)}
      const result = await taskCollection.deleteOne(query)
      res.send(result)
    })
    
    await client.db("admin").command({ ping: 1 });
    console.log(" You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

app.listen(port,() => {
  console.log("Server is running")
})

// 2 database
// task ,user 

// post
// app.post("/add-task",async(req,res)=>{
//   const task = req.body;
//   const result = await 
// })


//  read

// update 

//  delete

