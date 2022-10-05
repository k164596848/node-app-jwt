require('dotenv').config()

// call "express" library 
const express = require('express')
const app = express()

const jwt =require('jsonwebtoken')

app.use(express.json())

// usually we wiil store the refreshToken in a Database table or Redis cache
let refreshTokens =[]

app.post('/token',(req,res)=>{
// first valid the refreshToken then create a new accessToken, 
// send a respose whit new accessToken to client

    const refreshToken = req.body.token

    //if the refreshToken is already known then send 401
    if(refreshToken == null ) return res.sendStatus(401)

    // if the refreshToken is not exsist then send 403
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err, user)=>{

        if(err) return res.sendStatus(403)

        const accessToken = generateAccessToken({ name:user.name})
        // response  the new accessToken
        res.json({accessToken:accessToken})
    })

})


app.post('/login',(req,res)=>{
    //Authenticate user 

    const username = req.body.username
    const user = {name: username}

    console.log(user)
    // call the generateAccessToken to create a secret key 
    const accessToken = generateAccessToken(user)
    // use the 
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    // 
    refreshTokens.push(refreshToken)

    res.json({accessToken: accessToken , refreshToken: refreshToken})
})

function generateAccessToken(user){
    // add the expiration date in the jwt access token 
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '30s'})

}

console.log('port on 4000')

app.listen(4000)