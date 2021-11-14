import { useContext, useEffect } from "react"
import { RestaurantsContext } from '../context/RestaurantsContext'
import RestaurantFinder from "../apis/RestaurantFinder"
import { useNavigate } from 'react-router-dom';
import StarRating from "./StarRating";

export default function RestaurantList(props) {
  const navigate = useNavigate();
  const {restaurants, setRestaurants} = useContext(RestaurantsContext)

  useEffect(()=>{
    const fetchData = async () => {
      try{
        const response = await RestaurantFinder.get('/')
        setRestaurants(response.data.data.restaurants)
      }catch(err){
        console.log(err)
      }
    }
    fetchData()
  },[setRestaurants])

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    try{
      await RestaurantFinder.delete(`/${id}`)
      setRestaurants(oldRestaurants=>{
        return(
          oldRestaurants.filter(restaurant=>{
            return restaurant.id !== id
          })
        )
      })

    }catch(err){
      console.log(err)
    }
  }

  const handleUpdate = (e, id) => {
    e.stopPropagation()
    navigate(`/restaurants/${id}/update`)
  }

  const handleRestaurantSelect = (id) => {
    navigate(`/restaurants/${id}`)
  }

  const renderRating = (restaurant) =>{
    if (!restaurant.count){
      return <span>0 reviews</span>
    }
    return(
      <>
        <StarRating rating={restaurant.average_rating} />
        <span className="ml-5">{restaurant.count}</span>
      </>
    )

  }
 
  return (
    <div className="list-group">
      <table className="table table-dark table-hover">
        <thead>
          <tr className="bg-primary">
            <th scope="col">Restaurant</th>
            <th scope="col">Location</th>
            <th scope="col">Price Range</th>
            <th scope="col">Ratings</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {restaurants &&
            restaurants.map(restaurant => (
              <tr onClick={()=>handleRestaurantSelect(restaurant.id)} key={restaurant.id}>
                <td>{restaurant.name}</td>
                <td>{restaurant.location}</td>
                <td>{"$".repeat(restaurant.price_range)}</td>
                <td>{renderRating(restaurant)}</td>
                <td>
                  <button onClick={(e)=>handleUpdate(e, restaurant.id)} className="btn btn-warning">Update</button>
                </td>
                <td><button onClick={(e)=>handleDelete(e, restaurant.id)} className="btn btn-danger">Delete</button></td>
              </tr>
            )) 
          }
        </tbody>
      </table>
    </div>
  )
}
