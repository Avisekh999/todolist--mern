import React from "react";
import { Link, Redirect } from "react-router-dom";
import { useAuth } from "../redux/hooks";
import { GoogleLogin } from 'react-google-login';
import axios from "axios"


const Landing = () => {
  const {loginUser, registerUser, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }


  const handleLogin = (response) => {
    axios({
      method: 'POST',
      url: "http://localhost:5000/api/auth/googlelogin",
      data: { tokenId: response.tokenId }
    }).then(response => {
      console.log("google login success", response);
      const data = response.data
      const name = data.name 
      const email = data.email 
    
      if(data.password){
        const password = data.password
        registerUser({ name, email, password });
      }
      
      if(data.user){
        
        
        const user = data.user;
        const email = user.email;
       
        const password = email+"abc123"
        console.log(email)
        loginUser(email, password);
      }

     

    })


    console.log(response)


  }




  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large m-2">Todo App</h1>
          <p className="lead m-2">
            Create todos and manage them easily.
          </p>
          <GoogleLogin
            clientId='656840063369-v9jes2g7h44nij9fd2aej0mgd8lvv0d5.apps.googleusercontent.com'
            buttonText="Log in with Google"
            onSuccess={handleLogin}
            onFailure={handleLogin}
            cookiePolicy={'single_host_origin'}
          />

          <div className="buttons m-4">
            <Link to="/register" className="btn btn-primary m-2">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-light m-2">
              Login
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Landing;
