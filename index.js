const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.2b3737i.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// middlewere
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('welcome')
})

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect()

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}

run().catch(console.dir);



app.listen(port, () => {
    console.log(`my project listening on port : ${port}`)
})