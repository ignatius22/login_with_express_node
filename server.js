if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))
app.use(flash())
app.use(methodOverride('_method'))
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())

const initializePassport = require('./passport.config')
initializePassport(passport, email => user.find(user => user.email === email),
id => user.find(user => user.id === id)
)

const user =  []


app.get('/',checkAuthenticated, (req,res)=>{
    res.render('index.ejs',{name: req.user.name})
})

app.get('/login',notAuthenticated, (req,res)=>{
    res.render('login.ejs',{
    })
})

app.post('/login',notAuthenticated,passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash:true
}))

app.get('/register',notAuthenticated, (req,res)=>{
    res.render('register.ejs',{
    })
})

app.post('/register',notAuthenticated,async (req,res)=>{
try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    user.push({
        id: Date.now().toString(),
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    })
    res.redirect('/login')
}
catch{
    res.redirect('/register')
}

console.log(user)

})

app.delete('/logout',(req,res)=>{
    req.logOut()
    res.redirect('/login')
})




function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function notAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return  res.redirect('/')
    }
    next()
}

const port = process.env.port || 4000

app.listen(port, ()=>{
    console.log(`server got initialized on port ${port}`)
})