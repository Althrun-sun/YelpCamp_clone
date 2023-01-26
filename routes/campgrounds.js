const express = require('express')
const router = express.Router()
const catchAsync=require('../utils/catchAsync')
const Campground=require('../models/campground')
const { isLoggedIn, isAuthor , validateCampground} = require('../middleware')









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
        
        const newcampground=new Campground(req.body.campground)
        newcampground.author = req.user._id
        await newcampground.save()
        req.flash('success','Successfully made a new campground!')
        res.redirect(`/campgrounds/${newcampground._id}`)
}))

// show single campground details
router.get('/:id',catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author')
    console.log(campground)
    // error rasing function
    if(!campground){
        req.flash('error','Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}))

// edit the campgroundinformation
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(async (req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id) 
    // error rasing function
    if(!campground){
        req.flash('error','Cannot find that campground!')
        return res.redirect('/campgrounds')
    } 
    res.render('campgrounds/edit',{campground})
}))
router.put('/:id',isLoggedIn,isAuthor,validateCampground,catchAsync(async (req,res)=>{
    
    const {id}=req.params
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))  

// delete the campground
router.delete('/:id',isLoggedIn, isAuthor, catchAsync(async (req,res)=>{
    const {id}=req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted that campground!')
    res.redirect('/campgrounds')
}))

module.exports = router