const express = require('express')
const router = express.Router()
const catchAsync=require('../utils/catchAsync')
const Campground=require('../models/campground')
const { isLoggedIn, isAuthor , validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')


// browser all the campgrounds
router.get('/', catchAsync(campgrounds.index))

// create new campground
router.get('/new',isLoggedIn, campgrounds.renderNewFrom)

router.post('/',isLoggedIn,validateCampground, catchAsync(campgrounds.createCampground))

// show single campground details
router.get('/:id',catchAsync(campgrounds.showCampground))

// edit the campgroundinformation
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))

router.put('/:id',isLoggedIn,isAuthor,validateCampground,catchAsync(campgrounds.updateCampground))  

// delete the campground
router.delete('/:id',isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router