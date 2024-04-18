import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import achillesLogo from '../images/companyLogo.png';
import { CgProfile } from "react-icons/cg";
import { CiShop } from "react-icons/ci";
import './Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [userType, setType] = useState("");

    useEffect(() => {
        if (localStorage.getItem('userEmail')) {
            setLoggedIn(true)
        } 
        else {
            setLoggedIn(false)
        }
        if(localStorage.getItem('userType') !== undefined)
            setType(localStorage.getItem('userType'));
    }, []);

    const handleLogin = () => {
        navigate('/Login');
    };
    const coninueShopping = () =>{
        navigate('/Products')
    }

    const handleLogout = () => {
        const userEmail = localStorage.getItem('userEmail');

        fetch('https://cosc-3380-6au9.vercel.app/api/handlers/users/logoutUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail })
        }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Logout successful:', data);
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userType');
                setLoggedIn(false); 
                navigate('/Login');
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    };

    return (
        <div className="nav-container">
            <div className="left-side">
                <div id="logo-space">
                    <Link to="/Home">
                        <button id="logo-button">
                            <img src={achillesLogo} alt="Achilles Logo" />
                        </button>
                    </Link>
                </div>
            </div>
            <div className="right-side">
                {isLoggedIn ? (
                    <>
                        {(userType === 'Manager' || userType === 'Administrator') && (
                            <button className="nav-button" id="admin-button" onClick={() => navigate('/Admin')}>Manager Portal</button>
                        )}
                        {userType === 'Employee' && (
                            <button className="nav-button" id="emplo-button" >Employee Button</button>
                        )}
                        {userType === 'Customer' && (
                            <button className="nav-button" id="cart-button" onClick={() => navigate('/Cart')}>My Cart</button>
                        )}
                        <button className="nav-button" id="logout-button" onClick={handleLogout}>Logout</button>
                        <div className="nav-button" id="profile-button" onClick={() => navigate('/MyProfile')}>
                                <CgProfile />
                        </div>
                    </>
                ) : (
                    <>
                        <button className="nav-button" id="login-button" onClick={handleLogin}>Login</button>
                        <button className="nav-button" id="register-button" onClick={() => navigate('/Register')}>Register</button>
                    </>
                )}
            </div>
            <div className="nav-button" id="continue-shopping" onClick={() => navigate('/Products')}>
                <CiShop />
            </div>
        </div>

    );
}