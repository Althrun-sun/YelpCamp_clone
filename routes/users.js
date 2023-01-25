const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')

router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register',catchAsync(async(req,res)=>{
    try{
        const {email,username,password}=req.body
        const user = new User({email,username})
        const registerUser = await User.register(user,password)
        req.login(registerUser,err=>{
            if(err) return next(err)
            req.flash('success','Welcome to Yelpcamp build by Althrun Sun!')
            res.redirect('/campgrounds')
        })

        
    } catch (err){
        req.flash('error', err.message)
        res.redirect('register')
    }
}))

router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo: true}),  (req,res)=>{
    req.flash('success','Wecome back!')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    // console.log('the url now is',redirectUrl)
    res.redirect(redirectUrl)
})

router.get('/logout',(req,res)=>{
    req.logout(()=>{
        req.flash('success','Goodbye!')
        res.redirect('/campgrounds')
    })
    
})

module.exports =router