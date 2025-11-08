const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 3000

// middlewere
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('welcome')
})

app.listen(port, () => {
    console.log(`my project listening on port : ${port}`)
})