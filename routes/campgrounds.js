const express = require('express')
const router = express.Router()
const catchAsync=require('../utils/catchAsync')
const Campground=require('../models/campground')
const { isLoggedIn, isAuthor , validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })


// browser all the campgrounds
router.get('/', catchAsync(campgrounds.index))

// create new campground
router.get('/new',isLoggedIn, campgrounds.renderNewFrom)
router.post('/',isLoggedIn,upload.array('image'),validateCampground, catchAsync(campgrounds.createCampground))

// router.post('/',upload.array('image'),(req,res)=>{
//     console.log(req.body,req.files)
//     res.send('It work for image upload')
// })

// show single campground details
router.get('/:id',catchAsync(campgrounds.showCampground))

// edit the campgroundinformation
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))
router.put('/:id',isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))  

// delete the campground
router.delete('/:id',isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router