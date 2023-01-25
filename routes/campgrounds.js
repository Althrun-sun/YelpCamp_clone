const express = require('express')
const router = express.Router()
const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError')
const Campground=require('../models/campground')
const {campgroundSchema}=require('../schemas.js')


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
router.get('/new',(req,res)=>{
    res.render('campgrounds/new')
})

router.post('/',validateCampground, catchAsync(async (req,res,next)=>{

        const newcampground=new Campground(req.body.campground)
        await newcampground.save()
        res.redirect(`/campgrounds/${newcampground._id}`)
}))

// show single campground details
router.get('/:id',catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews')
    
    res.render('campgrounds/show',{campground})
}))

// edit the campgroundinformation
router.get('/:id/edit',catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id)  
    res.render('campgrounds/edit',{campground})
}))
router.put('/:id',validateCampground,catchAsync(async (req,res)=>{
    const {id}=req.params
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
}))  

// delete the campground
router.delete('/:id', catchAsync(async (req,res)=>{
    const {id}=req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

module.exports = router