import '../css/Login.css';
import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

function Login(){
    const navigate  = useNavigate();
    const [currentUser, setCurrentUser] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [wrongpw, setwrongpw] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const { login } = useUser();
    const { logout } = useUser();


    useEffect(() => {
      const storedRememberMe = localStorage.getItem('rememberMe') === 'true';
      setRememberMe(storedRememberMe);
    },[])
    
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);

    }

    const handlePaswordChange = (event) => {
        setPassword(event.target.value);
    }

    useEffect(() => {
        client.get("/user")
        .then(function(res){
        setCurrentUser(true)
    
        })
        .catch(function(error){
        setCurrentUser(false);
        })
    },[])


    function submitRegistration(e){
        e.preventDefault();
        client.post(
            'login/',
            {
                username:username,
                password:password
            }
        ).then(function(res){
            if (username || password)
            {
                localStorage.setItem('username', username);
                login();
                navigate ('/scrape')
            }
            navigate ('/scrape')
        }).catch(function(error){

            console.error(error);
            if(error.response){
                console.log(error.response.data)
                logout()
                setwrongpw(true)
            } 
        });

        if(rememberMe){
          localStorage.setItem('rememberMe','true');
        } else {
          localStorage.removeItem('rememberMe')
        }
    }

    return (
      <div className="login-view" style={{ paddingTop: "100px" }}>
        <main className="form-signin w-100 m-auto">
          <form onSubmit={(e) => submitRegistration(e)}>
            <img
              className="mb-4"
              src="/logo.png"
              alt=""
              width="100"
              height="100"
            />
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
            <div className="wrongpw">
              {wrongpw ? (
                <div className="error-message" style={{ color: "red" }}>
                  Wrong username or password. Please try again.
                </div>
              ) : null}
            </div>
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="floatingInput"
                name="username"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
              />
              <label htmlFor="floatingInput">Username</label>
            </div>
            <div className="htmlForm-floating">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                value={password}
                onChange={handlePaswordChange}
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            <div className="form-check text-start my-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                value="remember-me"
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Remember me
              </label>
            </div>
            <button className="btn btn-primary w-100 py-2" type="submit">
              Sign in
            </button>
          </form>
        </main>
      </div>
    );
}

export default Login;