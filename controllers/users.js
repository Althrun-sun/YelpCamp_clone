const User = require('../models/user')

module.exports.renderRegister=(req,res)=>{
    res.render('users/register')
}

module.exports.register = async(req,res,next)=>{
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
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login')
}

module.exports.login =(req,res)=>{
    req.flash('success','Wecome back!')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    // console.log('the url now is',redirectUrl)
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res)=>{
    req.logout(()=>{
        req.flash('success','Goodbye!')
        res.redirect('/campgrounds')
    })
    
}