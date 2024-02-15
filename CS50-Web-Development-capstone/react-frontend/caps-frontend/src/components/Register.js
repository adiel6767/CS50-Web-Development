import React, { useState } from 'react';
import axios from 'axios';
import ScrapeForm from './ScrapeForm';
import { useUser } from './UserContext';
import {useNavigate} from 'react-router-dom';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});
 

function Register(){
    const navigate = useNavigate();
    const [currentUser] = useState(false);
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, SetPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [agreeToTerms,setAgreeToTerms] = useState(false)

    const {login} = useUser();


    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handlePasswordChange = (event) => {
        SetPassword(event.target.value)
    }

    const handleRepeatPassword = (event) => {
        setRepeatPassword(event.target.value)
    }

    const handleAgreeToTerms = (event) => {
        const isChecked = event.target.checked
        setAgreeToTerms(isChecked);
  
        
    }; 

    function submitRegistration(e) {
        e.preventDefault();
        client.post(
          "sign-up/",
          {
            email: email,
            username: username,
            password: password
          }
         ).then(function(res) {
           client.post(
             "login/",
             { 
               username: username,
               password: password
             }
           ).then(function(res) {
            localStorage.setItem('username',username);
            login();
            navigate('/scrape')
           });
         });
      }
      
    if (currentUser){
        return <ScrapeForm />
    }

    return (
      <div className="register">
        <section className="vh-100" style={{ backgroundColor: "#eee" }}>
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-lg-12 col-xl-11">
                <div
                  className="card text-black"
                  style={{ borderRadius: "25px" }}
                >
                  <div className="card-body p-md-5">
                    <div className="row justify-content-center">
                      <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                          Sign up
                        </p>
                        <form
                          className="mx-1 mx-md-4"
                          onSubmit={(e) => submitRegistration(e)}
                        >
                          <div className="d-flex flex-row align-items-center mb-4">
                            <div className="form-outline flex-fill mb-0">
                              <input
                                type="text"
                                name="Username"
                                id="form3Example1c"
                                className="form-control"
                                placeholder="Username"
                                value={username}
                                onChange={handleUsernameChange}
                              />
                            </div>
                          </div>
                          <div className="d-flex flex-row align-items-center mb-4">
                            <div className="form-outline flex-fill mb-0">
                              <input
                                type="email"
                                name="email"
                                id="form3Example3c"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                              />
                            </div>
                          </div>
                          <div className="d-flex flex-row align-items-center mb-4">
                            <div className="form-outline flex-fill mb-0">
                              <input
                                type="password"
                                name="password"
                                id="form3Example4c"
                                className="form-control"
                                placeholder="password"
                                value={password}
                                onChange={handlePasswordChange}
                              />
                            </div>
                          </div>
                          <div className="d-flex flex-row align-items-center mb-4">
                            <div className="form-outline flex-fill mb-0">
                              <input
                                type="password"
                                name="repeatPassword"
                                id="form3Example4cd"
                                className="form-control"
                                placeholder="repeat password"
                                value={repeatPassword}
                                onChange={handleRepeatPassword}
                              />
                            </div>
                          </div>
                          <div className="form-check d-flex justify-content-center mb-5">
                            <input
                              className="form-check-input me-2"
                              type="checkbox"
                              value={agreeToTerms}
                              id="form2Example3c"
                              onChange={handleAgreeToTerms}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="form2Example3"
                            >
                              I agree all statements in{" "}
                              <a href="#!">Terms of service</a>
                            </label>
                          </div>
                          <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                            <button
                              type="submit"
                              className="btn btn-primary btn-lg"
                            >
                              Register
                            </button>
                          </div>
                        </form>
                      </div>
                      <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                        <img
                          src="/ninja2.png"
                          className="img-fluid"
                          alt="Sample"
                          style={{height: "450px"}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );

}


export default Register;
