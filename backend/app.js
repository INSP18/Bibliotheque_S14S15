require('dotenv').config()

const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000 

app.use('/', (req, res)=>{
    res.send('all routes')
})

app.listen(PORT, ()=>{
    console.log(`Server running and listening on ${PORT}`)
})