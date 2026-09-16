import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

import express, { json } from 'express'
import auteursRoutes from './routes/auteursRoutes.js'
import adherentsRoutes from './routes/adherentsRoutes.js'
import livresRoutes from './routes/livresRoutes.js'

const app = express()
const PORT = process.env.PORT || 3000 

app.use(json())
app.use(cors())

app.get('/', (request, response)=>{
    response.json("Bienvenu sur l'API bibliothèque")
})

app.use('/api/auteurs', auteursRoutes)
app.use('/api/adherents', adherentsRoutes)
app.use('/api/livres', livresRoutes)

app.listen(PORT, ()=>{
    console.log(`Server running and listening on http://localhost:${PORT}`)
})