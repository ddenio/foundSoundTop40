const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()
app.use(cors())

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'artist'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    }).catch(error=>{
        console.error("Error:", error)
        throw new error(error)
        // or
        // process.exit(1)
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
    songName: request.body.songName, likes: 1})
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

app.put('/removeOneLike', async (request, response) => {
    try {
        const { artistNameS, songNameS, likesS } = request.body;
        const updatedLikes = likesS - 1;
        await db.collection('artists').updateOne({ artistName: artistNameS, songName: songNameS }, { $set: { likes: updatedLikes } });

        if (updatedLikes < 0) {
            // Delete the song if likes go below or equal to 0
            await db.collection('artists').deleteOne({ artistName: artistNameS, songName: songNameS });
            console.log('Song deleted due to negative likes or zero likes');
            response.json({ message: 'Song deleted due to negative likes or zero likes' });
        } else {
            console.log('Removed One Like');
            response.json('Like Removed');
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal server error' });
    }
});
// app.put('/removeOneLike', (request, response) => {

//         const { artistNameS, songNameS, likesS } = request.body;
//         const updatedLikes = likesS - 1;
//         db.collection('artists').updateOne({ artistName: artistNameS, songName: songNameS }, { $set: { likes: updatedLikes } });

//         if (updatedLikes < 0) {
//             // Delete the song if likes go below 0
//             db.collection('artists').deleteOne({ artistName: artistNameS, songName: songNameS });
//             console.log('Song deleted due to negative likes');
//             response.json({ message: 'Song deleted due to negative likes' });
//         } else {
//             console.log('Removed One Like');
//             response.json('Like Removed');
//         }
    
//     // db.collection('artists').updateOne({artistName: request.body.artistNameS, songName: request.body.songNameS,likes: request.body.likesS},{
//     //     $set: {
//     //         likes:request.body.likesS - 1
//     //       }
//     // },{
//     //     sort: {_id: -1},
//     //     upsert: true
//     // })
//     // .then(result => {
//     //     console.log('Removed One Like')
//     //     response.json('Like Removed')
//     // })
//     // .catch(error => console.error(error))

// })

app.delete('/deleteArtist', (request, response) => {
    db.collection('artists').deleteOne({artistName: request.body.artistNameS})
    .then(result => {
        console.log('Artist Deleted')
        response.json('Artist Deleted')
    })
    .catch(error => console.error(error))

})


app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})