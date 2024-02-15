import React from 'react';
import Navbar from './components/Navbar';
import ScrapeForm from './components/ScrapeForm';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import Archive from './components/Archive';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './components/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const ProtectedRoute = ({ element }) => {
    const { currentUser } = useUser();

    return currentUser ? element : <Navigate to="/login" replace />;
  };

  return (
    <UserProvider>
      <div className="component">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/sign-up' element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/scrape" element={<ProtectedRoute element={<ScrapeForm />} />} />
            <Route path="/archive" element={<ProtectedRoute element={<Archive />} />} />
            <Route path="/logout" />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </div>
    </UserProvider>
  );
}

export default App;
