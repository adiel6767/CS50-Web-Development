import '../css/Navbar.css';
import { useUser } from './UserContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

function Navbar(){

const navigate  = useNavigate();
const {logout} = useUser();

const { currentUser } = useUser();
const handleLogout = (e) => {
    e.preventDefault();
    client.post(
        'logout/'
    )
    .then(function(res){
        localStorage.removeItem('username'); 
        logout()
        navigate ('/login')
    })
};

const username = localStorage.getItem("username");



return (
  <header>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      {username ? (
        <a className="navbar-brand" href="#" style={{ marginLeft: "10px" }}>
          {username}
        </a>
      ) : (
        <a className="navbar-brand" href="#" style={{ marginLeft: "10px" }}>
          StealthScraper
        </a>
      )}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="/">
              Home
            </a>
          </li>
          {currentUser ? null : (
            <li className="nav-item">
              <a className="nav-link" href="/sign-up">
                Sign Up
              </a>
            </li>
          )}
          {currentUser ? null : (
            <li className="nav-item">
              <a className="nav-link" href="/login">
                Login
              </a>
            </li>
          )}
          {currentUser ? (
            <li className="nav-item">
              <a className="nav-link" href="/scrape">
                Scrape
              </a>
            </li>
          ) : null}
          {currentUser ? (
            <li className="nav-item">
              <a className="nav-link" href="/archive">
                Archive
              </a>
            </li>
          ) : null}
          {currentUser ? (
            <li className="nav-item">
              <a className="nav-link" href="/logout" onClick={handleLogout}>
                Logout
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </nav>
  </header>
);
}

export default Navbar;