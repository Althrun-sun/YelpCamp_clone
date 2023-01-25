const express = require('express')
const router = express.Router()
const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError')
const Campground=require('../models/campground')
const {campgroundSchema}=require('../schemas.js')
const { isLoggedIn} = require('../middleware')

// middleware for validate
const validateCampground = (req,res,next)=>{
    const { error }=campgroundSchema.validate(req.body)
    if(error){
        const msg= error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    } else{
        next()
    }
}

// browser all the campgrounds
router.get('/', catchAsync(async(req,res)=>{
    const campgrounds=await Campground.find({})
    res.render('campgrounds/index',{ campgrounds })

}))


// create new campground
router.get('/new',isLoggedIn, (req,res)=>{

    res.render('campgrounds/new')
})

router.post('/',isLoggedIn,validateCampground, catchAsync(async (req,res,next)=>{
        req.flash('success','Successfully made a new campground!')
        const newcampground=new Campground(req.body.campground)
        await newcampground.save()
        res.redirect(`/campgrounds/${newcampground._id}`)
}))

// show single campground details
router.get('/:id',catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews')
    // error rasing function
    if(!campground){
        req.flash('error','Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}))

// edit the campgroundinformation
router.get('/:id/edit',isLoggedIn,catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id) 
    // error rasing function
    if(!campground){
        req.flash('error','Cannot find that campground!')
        return res.redirect('/campgrounds')
    } 
    res.render('campgrounds/edit',{campground})
}))
router.put('/:id',isLoggedIn,validateCampground,catchAsync(async (req,res)=>{
    const {id}=req.params
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success','Successfully updated campground!')

    res.redirect(`/campgrounds/${campground._id}`)
}))  

// delete the campground
router.delete('/:id',isLoggedIn, catchAsync(async (req,res)=>{
    const {id}=req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted that campground!')
    res.redirect('/campgrounds')
}))

module.exports = router