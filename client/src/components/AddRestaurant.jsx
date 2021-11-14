import { useContext, useState } from "react"
import RestaurantFinder from '../apis/RestaurantFinder'
import { RestaurantsContext } from "../context/RestaurantsContext"

export default function AddRestaurant() {
  const {addRestaurants} = useContext(RestaurantsContext)

  const[name,setName] = useState('')
  const[location,setLocation] = useState('')
  const[priceRange,setPriceRange] = useState('Price Range')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const response = await RestaurantFinder.post("/",{
        name,
        location,
        price_range:priceRange
      })
      addRestaurants(response.data.data.restaurant)
    }catch(err){

    }
  }

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-around">
          <div className="col-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="name"
              value={name} 
              onChange={e=>setName(e.target.value)}
            />
          </div>
          <div className="col-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="location"
              value={location} 
              onChange={e=>setLocation(e.target.value)} 
            />
          </div>
          <div className="col-3">
            <select 
              value={priceRange} 
              onChange={e=>setPriceRange(e.target.value)}
              className="form-select"
            >
              <option disabled>Price Range</option>
              <option value="1">$</option>
              <option value="2">$$</option>
              <option value="3">$$$</option>
              <option value="4">$$$$</option>
              <option value="5">$$$$$</option>
            </select>
          </div>
          <div className="col-1">
            <button type="submit" className="btn btn-primary">Add</button>
          </div>
        </div>
      </form>
    </div>
  )
}
