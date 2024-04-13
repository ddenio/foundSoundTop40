const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const PORT = process.env.PORT || 2121
require('dotenv').config()
app.use(cors())

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'artist'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/',(request, response)=>{
    db.collection('artists').find().sort({likes: -1}).toArray()
    .then(data => {
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.post('/addArtist', (request, response) => {
    db.collection('artists').insertOne({artistName: request.body.artistName,
    songName: request.body.songName, likes: 0})
    .then(result => {
        console.log('Song Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/addOneLike', (request, response) => {
    db.collection('artists').updateOne({artistName: request.body.artistNameS, songName: request.body.songNameS,likes: request.body.likesS},{
        $set: {
            likes:request.body.likesS + 1
          }
    },{
        sort: {_id: -1},
        upsert: true
    })
    .then(result => {
        console.log('Added One Like')
        response.json('Like Added')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteArtist', (request, response) => {
    db.collection('artists').deleteOne({artistName: request.body.artistNameS})
    .then(result => {
        console.log('Artist Deleted')
        response.json('Artist Deleted')
    })
    .catch(error => console.error(error))

})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})