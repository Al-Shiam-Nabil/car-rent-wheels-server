const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        const database = client.db('rentWheelsDB')
        const carCollections = database.collection('carCollections')

        app.post('/cars', async (req, res) => {
            const carData = req.body
            const result = await carCollections.insertOne(carData)
            res.send(result)

        })

        //get all cars
        app.get('/cars', async (req, res) => {
            const cursor = carCollections.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        //get cars with id
        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: new ObjectId(id) }

            const result = await carCollections.findOne(query)

            res.send(result)
        })

        // search
        app.get('/search', async (req, res) => {
            const searchText = req.query.search
            function escapeRegex(text) {
                return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }

            const result = await carCollections.find({ car_name: { $regex: escapeRegex(searchText), $options: 'i' } }).toArray()
            res.send(result)
        })


        // latest 6 car api
        app.get('/latest-cars', async (req, res) => {
            const sortFields = { create_at: -1 }
            const cursor = carCollections.find().sort(sortFields).limit(6)
            const result = await cursor.toArray()
            res.send(result)
        })

        // car update

        app.patch('/cars/:id', async (req, res) => {
            const id = req.params.id
            const updatedInfo = req.body
            const query = { _id: new ObjectId(id) }
            const update = { $set: updatedInfo }
            const result = await carCollections.updateOne(query, update)
            res.send(result)
        })



        app.delete('/cars/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await carCollections.deleteOne(query)
            res.send(result)
        })

        app.get('/my-cars', async (req, res) => {
            const email = req.query.email;
            const query = {}
            if (email) {
                query.provider_email = email;

            }

            const projectFields = { car_name: 1, category: 1, price_per_day: 1, status: 1 }

            const cursor = carCollections.find(query).project(projectFields)
            const result = await cursor.toArray()

            res.send(result)
        })

        app.get('/my-bookings', async (req, res) => {
            const email = req.query.email
            const cursor = carCollections.find({ "booked_user.email": email })
            const result = await cursor.toArray()
            res.send(result)
        })

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