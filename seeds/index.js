const mongoose = require('mongoose')
const Campground=require('../models/campground')
const cities = require('./cities')
const {places,descriptors}=require('./seedHelper')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp'
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

const sample = array=>array[Math.floor(Math.random()*array.length)]

const seedDB = async ()=>{
    await Campground.deleteMany({})
    for(let i=0;i<50;i++)
    {
        const random1000=Math.floor(Math.random()*1000)
        const price=Math.floor(Math.random()*30)+10
        const camp=new Campground({
            author:'63d0cf281d61e18f6c95cfbc',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            // image:'https://source.unsplash.com/collection/483251',
            description:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum pariatur omnis, impedit a dolorem similique velit quo dolores, deleniti sunt nostrum nam sequi, accusamus vel fugit maiores inventore? Laborum, tenetur.",
            price,
            geometry:{
              type:"Point",
              coordinates:[-113.1331,47.0202]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/do0ab2prd/image/upload/v1674938300/YelpCamp/iqkab02zjvomalt6rapu.jpg',
                  filename: 'YelpCamp/iqkab02zjvomalt6rapu'
                },
                {
                  url: 'https://res.cloudinary.com/do0ab2prd/image/upload/v1674938300/YelpCamp/v1oej1jf2m7dad3ix65k.jpg',
                  filename: 'YelpCamp/v1oej1jf2m7dad3ix65k'
                }
              ]
        })
        await camp.save()
    }
}
seedDB().then(()=>{
    mongoose.connection.close()
})