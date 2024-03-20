/*import React, { useState } from "react";


import { Layout, Button, Drawer } from "antd";
import{ LeftMenu }from "./leftMenu";
import RightMenu from "./RightMenu";
import { MenuOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBackButton } from '../btncontext/btn';
import { FaArrowLeft } from 'react-icons/fa';
const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { handleBackClick } = useBackButton();
  const showDrawer = () => {
    setVisible(!visible);
  }; 

  let { pathname: location } = useLocation();

  useEffect(() => {
    setVisible(false);
  }, [location]);

  return (
    <>
      <nav className="navbar">
        <Layout className="layout">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: '1rem' }}>
          <h3
             className="brand-font cursor-pointer"
             onClick={() => navigate("/")}
            >
            <img src="./fb.png" alt="logo" className="w-10 h-10" />
          </h3>
           </div>
            <div
              className="navbar-menu"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <button onClick={handleBackClick} style={{ display: 'flex', alignItems: 'center' }}>
              <FaArrowLeft style={{ marginRight: '0.5rem' }} />
              Go Back
              </button>
               <div className="leftMenu" style={{ marginLeft: '1rem' }}>
               <LeftMenu mode={"horizontal"} />
               </div>
              <div className="rightMenu">
                <RightMenu mode={"horizontal"} />
              </div>
            </div>
            <Button
              className="menuButton mb-10 "
              type="text"
              onClick={showDrawer}
              style={{ position: "absolute", right: 10 }}
            >
              <MenuOutlined />
            </Button>
            <Drawer
              title={"Brand Here"}
              placement="right"
              closable={true}
              onClose={showDrawer}
              visible={visible}
              style={{ zIndex: 99999 }}
            >
             
              <RightMenu mode={"inline"} />
            </Drawer>
        
        </div>
        </Layout>
      </nav>
    </>
  );
};

export default Navbar;

*/

import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import { FiMenu } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { useAuth } from '../auth/context/auth';
import { IoPersonCircleOutline } from "react-icons/io5";
import { signOut } from "firebase/auth";
import { auth } from "../../src/firebase";
import { useNavigate } from 'react-router-dom'; 

const Navbar = () => {
  const navigate = useNavigate();
    const [menu, setMenu] = useState("shop");

    const menuRef = useRef();
    const { user,setUser } = useAuth();
    const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    };

    /* STICKY NAVBAR */
    const [navbarSticky, setNavbarSticky] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScroll = () => {
        if (window.scrollY > 70) {
            setNavbarSticky(true);
        } else {
            setNavbarSticky(false);
        }
    };

    React.useEffect(() => {
      console.log("User:", user);
    }
    , [user]);

    /* Code for the close and open animation of hamburguer menu in mobile devices */
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleClick = (e) => {
        dropdownToggle();
        dropdown_toggle(e);
    };

    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };
 

    const logout = () => {
      if (window.confirm("Are you sure you want to log out?")) {
        signOut(auth)
          .then(() => {
            console.log("User signed out");
            setUser(null); 
            navigate("/", { replace: true });
          })
          .catch((error) => {
            console.error("Logout error:", error.message);
          });
      }
    };

    const handleLogout = () => {
        logout();
        toggleUserDropdown();
    };

    return (
        <div className={navbarSticky ? "navbar sticky" : "navbar"}>
            <div className="nav-logo">
            <img src="./fb.png" alt="logo" className="w-10 h-10" />
                <p>CYBERCAFE</p>
            </div>
            <ul ref={menuRef} className="nav-menu">
                <li onClick={() => { setMenu("explore") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='/'>Explore</Link> {menu === "Explore" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("features") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='/'>Features</Link> {menu === "Features" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("Aboutus") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='/about'>Aboutus</Link> {menu === "Aboutus" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("Contactus") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='/contact'>Contactus</Link> {menu === "Contactus" ? <hr /> : <></>}</li>
            </ul>
            <div className="nav-login-cart">
                {user ? (
                    <div className="nav-user-dropdown">
                        <div className="nav-user-info" onClick={toggleUserDropdown}>
                            <IoPersonCircleOutline className="nav-user-icon" />
                            <span>{user.email}</span>
                        </div>
                        {isUserDropdownOpen && (
                            <div className="nav-user-dropdown-menu">
                                <button onClick={handleLogout}>Sign Out</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to='/login'>
                        <button >Login</button>
                    </Link>
                )}
           
            </div>
            <div className='hamburger'>
                {isDropdownOpen ? (
                    <IoCloseSharp className='nav-dropdown' onClick={handleClick} />
                ) : (
                    <FiMenu className='nav-dropdown' onClick={handleClick} />
                )}
            </div>
        </div>
    );
};


export default Navbar;