import "./login.css"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import emailjs from '@emailjs/browser';

import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();
  const [startverify, setStartVerify] = useState(false)
  const [verifySuccess, setVerifySuccess] = useState(false)

  const [personUser, setPersonUser] = useState({
    username: "",
    hashed_password: ""
  });
  const [secPW, setSecPW] = useState("")
  const [verifycode, setVerifyCode] = useState("")
  const [inputverify, setInputVerify] = useState("")


  useEffect(() => { setVerifyCode(uuidv4()) }, [])


  const newUser = (user) => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_API}/newusers`, user)
    .then((response) => {
      console.log(response.data);
      navigate("/pleaselogin");

    })
    .catch((e) => console.error("catch", e)
    );

  }

  function handleInputVerify(e) {
    setInputVerify(e.target.value)

  }


  useEffect(() => {
    if (verifycode === inputverify && inputverify !== "" && verifycode !== "") {
      setVerifySuccess(true)
      newUser(personUser)
    }
  }, [personUser, verifycode, inputverify])



  const handleTextChange = (event) => {

    setPersonUser({ ...personUser, [event.target.id]: event.target.value });
  };


  const handleTextChange2 = (event) => {

    setSecPW(event.target.value);

  };

  console.log(personUser)
  console.log(secPW)

  const handleSubmit = (event) => {
    event.preventDefault();


    if (secPW !== personUser.hashed_password) {
      window.alert("Passwords Do Not Match");
    }
    else if (secPW === personUser.hashed_password) {



      setStartVerify(true)



      emailjs.init({
        publicKey: import.meta.env.VITE_PUBLIC_KEY_EMAILJS,
        limitRate: {
          // Set the limit rate for the application
          id: 'app',
          // Allow 1 request per 10s
          throttle: 1,
        },
      });
      //set the parameter as per you template parameter[https://dashboard.emailjs.com/templates]
      var templateParams = {
        user_email: personUser.username,
        to_name: personUser.username,
        from_name: 'HHP Admin',
        message: verifycode
      };

      emailjs.send(import.meta.env.VITE_SERVICE_ID_EMAILJS, import.meta.env.VITE_TEMPLATE_EMAILJS, templateParams)
        .then(function (response) {
          console.log('SUCCESS!', response.status, response.text);
        }, function (error) {
          console.log('FAILED...', error);
        });

    }
  };

  return (
    <div className="registerCONTAIN"> 
                <br></br>

    <h1>Register</h1>
      <p>Please fill in this form to create an account.</p>
        <div className="container">

      <form onSubmit={handleSubmit} style={{ margin: "auto", display: "justified" }}>


          <label htmlFor="username"><b>Email</b></label>

          <input type="email" value={personUser.username} onChange={handleTextChange}

            placeholder="Enter Email" name="username" id="username" required></input>

          <label htmlFor="hashed_password"><b>Password</b></label>
          <input type="password" value={personUser.hashed_password} placeholder="Enter Password" name="hashed_password" id="hashed_password" minLength="7" onChange={handleTextChange}
            required></input>

          <label htmlFor="hashed_password-repeat"><b>Repeat Password</b></label>

          <input type="password" placeholder="Repeat Password" minLength="7" name="hashed_password-repeat" id="hashed_password-repeat" value={secPW.secpass} onChange={handleTextChange2} required></input>

          <p>By creating an account you agree to our  <Link to="/termsconditions">Terms & Privacy</Link>.</p>
          <br></br>
          {!startverify ? <div><button  style={{padding:"10px"}}  type="submit" className="registerbtn">Register</button></div> : null}

          <div className="container-signin">
            <br></br>
            <div> <p>Already have an account? <Link to="/login">Login</Link>.</p></div>
            {verifySuccess === false ? <>{startverify ? <div style={{ backgroundColor: "#a4c67799", padding: "20px", borderRadius: "10px" }}><label htmlFor="name">Verify Your Email: input code sent to your email.</label>
              <p> If you have an account, Please Login and disregard Email Sent</p>
              <input onChange={(e) => { handleInputVerify(e) }} placeholder="Verification Code" type="text" id="verify" name="verify" />
            </div> : null}</> : <div>Please Wait...System Processing...</div>}
          </div>
      </form>        </div>

    </div>
  )
}

export default Register