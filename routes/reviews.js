const express = require('express')
const router = express.Router({mergeParams:true})
const catchAsync=require('../utils/catchAsync')
const Review = require('../models/review')
const Campground = require('../models/campground')
const reviews = require('../controllers/reviews')
const ExpressError=require('../utils/ExpressError')
const { validateReview , isLoggedIn,isReviewAuthor} = require('../middleware')





// create new review
router.post('/',isLoggedIn,validateReview ,catchAsync(reviews.createReview))

// delete review
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router