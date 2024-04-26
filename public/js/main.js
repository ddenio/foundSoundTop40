const deleteText = document.querySelectorAll('.fa-trash')
const thumbText = document.querySelectorAll('.fa-thumbs-up')
const thumbDown = document.querySelectorAll('.fa-thumbs-down')

Array.from(deleteText).forEach((element)=>{
    element.addEventListener('click', deleteArtist)
})

Array.from(thumbText).forEach((element)=>{
    element.addEventListener('click', addLike)
})

Array.from(thumbDown).forEach((element)=>{
    element.addEventListener('click', removeLike)
})

async function addLike(){
    const sName = this.parentNode.childNodes[3].innerText
    const bName = this.parentNode.childNodes[5].innerText
    const tLikes = Number(this.parentNode.childNodes[7].innerText)
    try{
        const response = await fetch('addOneLike', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'artistNameS': sName,
              'songNameS': bName,
              'likesS': tLikes
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function removeLike(){
    const sName = this.parentNode.childNodes[3].innerText
    const bName = this.parentNode.childNodes[5].innerText
    const tLikes = Number(this.parentNode.childNodes[7].innerText)
    try{
        const response = await fetch('removeOneLike', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'artistNameS': sName,
              'songNameS': bName,
              'likesS': tLikes
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function deleteArtist(){
    const sName = this.parentNode.childNodes[3].innerText
    const bName = this.parentNode.childNodes[5].innerText
    try{
        const response = await fetch('deleteArtist', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'artistNameS': sName,
              'songNameS': bName
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}