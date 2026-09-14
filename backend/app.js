require('dotenv').config()

const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000 

app.use(express.json())

app.get('/', (request, response)=>{
    response.json("Bienvenu sur l'API bibliothèque")
})
const auteursRoutes = require('./routes/auteursRoutes')
app.use('/api/auteurs', auteursRoutes)

app.listen(PORT, ()=>{
    console.log(`Server running and listening on http://localhost:${PORT}`)
})