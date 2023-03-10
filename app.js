if(process.env.NODE_ENV!=='production'){
    require('dotenv').config()
}

const express = require('express')
const path=require('path')
const mongoose = require('mongoose')
const ejsMate=require('ejs-mate')
const ExpressError=require('./utils/ExpressError')
const methodOveride=require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport=require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')


//refer to the routes make the code modulized
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')


const MongoDBStore = require("connect-mongo")(session);


const localDB= 'mongodb://127.0.0.1:27017/yelp-camp'
const cloudDB = process.env.DB_URL
const dbUrl = cloudDB
mongoose.connect(dbUrl
// ,{
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     useUnifiedTopology:true
// }
)

const db=mongoose.connection
db.on('error',console.error.bind(console,"connection error"))
db.once("open",()=>{
    console.log("Database connected")
})


const app=express()

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended: true }))
app.use(methodOveride('_method'))
app.use(express.static(path.join(__dirname,'public')))

const secret = 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    // console.log(req.session)
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})



app.use('/',userRoutes)
app.use("/campgrounds",campgroundRoutes)
app.use("/campgrounds/:id/reviews",reviewRoutes)

app.get('/',(req,res)=>{
    res.render('home')
})



app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500} = err
    if(!err.message) err.message='Oh no somthing went wrong'
    res.status(statusCode).render('error',{err})
})


app.listen(3000, ()=>{
    console.log('Serving on port 3000')
})