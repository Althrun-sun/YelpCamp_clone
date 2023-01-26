const Campground=require('../models/campground')

module.exports.index = async(req,res)=>{
    const campgrounds=await Campground.find({})
    res.render('campgrounds/index',{ campgrounds })
}

module.exports.renderNewFrom =(req,res)=>{
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req,res,next)=>{
        
    const newcampground=new Campground(req.body.campground)
    newcampground.author = req.user._id
    await newcampground.save()
    req.flash('success','Successfully made a new campground!')
    res.redirect(`/campgrounds/${newcampground._id}`)
}

module.exports.showCampground = async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author')
    
    // error rasing function
    if(!campground){
        req.flash('error','Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}

module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id) 
    // error rasing function
    if(!campground){
        req.flash('error','Cannot find that campground!')
        return res.redirect('/campgrounds')
    } 
    res.render('campgrounds/edit',{campground})
}

module.exports.updateCampground = async (req,res)=>{
    const {id}=req.params
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req,res)=>{
    const {id}=req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted that campground!')
    res.redirect('/campgrounds')
}