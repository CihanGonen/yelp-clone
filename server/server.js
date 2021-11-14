require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./db')//it finds index.js itself

const app = express()

// MIDDLEWARES

app.use(cors())
// when we send a request it takes the body of the request
// and attaches it to req
// basically we cant use req.body without this middleware
app.use(express.json())

// ROUTE HANDLERS

// get all restaurants
app.get('/api/v1/restaurants', async (req,res) => {
  
  try{

    const restaurantRatingsData = await db.query("select * from restaurants left join (select restaurant_id, COUNT (*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id");

    res.status(200).json({
      status:'successs',
      results: restaurantRatingsData.rows.length,
      data: {
        restaurants: restaurantRatingsData.rows
      }
    })

  }catch(err){
    console.log(err)
  }

})

// get a restaurant
app.get('/api/v1/restaurants/:id', async (req,res) => {

  try{
    // it saves us from sql injection attacks
    const restaurants = await db.query("select * from restaurants left join (select restaurant_id, COUNT (*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id=$1",[req.params.id]);

    const reviews = await db.query("SELECT * from reviews where restaurant_id = $1",[req.params.id])

    res.status(200).json({
      status:"success",
      data: {
        restaurant:restaurants.rows[0],
        reviews: reviews.rows
      }
    })

  }catch(err){
    console.log(err)
  }

})

// create a restaurant
app.post('/api/v1/restaurants', async (req,res)=>{
  console.log(req.body)

  try{
    const results = await db.query("INSERT INTO restaurants (name,location,price_range) VALUES($1,$2,$3) returning *",[req.body.name,req.body.location,req.body.price_range])
    console.log(results)
    res.status(201).json({
      status:"success",
      data: {
        restaurant:results.rows[0]
      }
    })

  }catch(err){
    console.log(err)
  }

})

// update restaurants
app.put('/api/v1/restaurants/:id', async (req,res)=>{

  try{
    const results = await db.query
      ("UPDATE restaurants SET name=$1,location=$2,price_range=$3 where id=$4 returning *",[req.body.name,req.body.location,req.body.price_range,req.params.id])

    res.status(200).json({
      status:"success",
      data: {
        restaurant:results.rows[0]
      }
    })
    
  }catch(err){
    console.log(err)
  }
})

// delete restaurant
app.delete('/api/v1/restaurants/:id', async (req,res)=>{

  try{
    const results = db.query('DELETE FROM restaurants where id = $1',[req.params.id])

    res.status(204).json({
      status:"success"
    })

  }catch(err){
    console.log(err)
  }

})

// add review

app.post('/api/v1/restaurants/:id/addReview',async (req,res)=>{
  try{
    const newReview = await db.query('INSERT INTO reviews (restaurant_id, name, review, rating) values ($1,$2,$3,$4) returning *',[req.params.id,req.body.name,req.body.review,req.body.rating])
    res.status(201).json({
      status:'success',
      data:{
        review:newReview.rows[0]
      }
    })
  }catch(err){
    console.log(err)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
  console.log(`server is up on port ${PORT}`)
})