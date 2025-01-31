import { useEffect } from "react";
import "./loading.css"
import { useNavigate } from "react-router-dom"

function PleaseLogin({ accessToken }) {
  const navigate = useNavigate()
  useEffect(() => {
    // Function to be executed after 2000 milliseconds (2 seconds)
    const timeoutId = setTimeout(() => {
  navigate("/login")  }, 2000)});
  


  return (

    <div id="loading-wrapper">
      <div id="loading-text">Loading!</div>
      {/* <div id="loading-text">Please Login</div> */}
      <div id="loading-content"></div>
    </div>


  )




}

export default PleaseLogin