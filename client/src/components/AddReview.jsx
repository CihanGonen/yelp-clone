import { useState } from "react"
import RestaurantFinder from "../apis/RestaurantFinder"
import {useParams, useNavigate, useLocation} from 'react-router-dom'

export default function AddReview() {
  const {id} = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [name,setName] = useState('')
  const [reviewText,setReviewText] = useState('')
  const [rating,setRating] = useState('Rating')

  const handleSubmit = async (e) =>{
    e.preventDefault()
    try{
      await RestaurantFinder.post(`/${id}/addReview`,{
        name,
        review:reviewText,
        rating
      })
      navigate("/")
      navigate(location.pathname)
    }catch(err){
      console.log(err)
    }
  
  }

  return (
    <div className="mb-2">
      <form onSubmit={handleSubmit}>
        <div className="form-row d-flex justify-content-between">
          <div className="form-group col-7">
            <label htmlFor="name">Name</label>
            <input 
              value={name}
              onChange={e=>setName(e.target.value)}
              id="name" 
              placeholder="name" 
              className="form-control" 
              type="text" 
            />
          </div>
          <div className="form-group col-4">
            <label htmlFor="rating">Rating</label>
            <select 
              value={rating}
              onChange={e=>setRating(e.target.value)}
              id="rating" 
              className="form-select" 
            >
              <option disabled>Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="Review">Review</label>
          <textarea 
            value={reviewText}
            onChange={e=>setReviewText(e.target.value)}
            className="form-control" 
            id="Review"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary mt-2">Submit</button>
      </form>
    </div>
  )
}
