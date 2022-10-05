require('dotenv').config()

const express = require('express')
const app = express()

const jwt =require('jsonwebtoken')

app.use(express.json())

const posts = [
    {
        username:'Danny',
        title:'Staff Engineer',
        role:'GHP Mentor'
    },
    {
        username:'Jim',
        title:'Engineer',
        role:'GHP New Commer'

    }
]

app.get('/posts',authenticateToken, (req,res) =>{
    res.json(posts.filter(post => post.username === req.user.name))
}) 



app.post('/login',(req,res)=>{
    //Authenticate user 

    const username = req.body.username
    const user = {name: username}

    console.log(user)

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken: accessToken})
})


function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    // make sure there is a token in authHeader
    if (token == null) {
        // 401 Unathorized 未授權
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        console.log(err)
        // 403 Forbidden 無訪問權限
        if (err) return res.sendStatus(403)
        req.user = user

        next()
    })
    
}
console.log('port on 3000')


app.listen(3000)