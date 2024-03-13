import React, { useState } from "react";
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
        <Layout  className="nav-header shadow-md">
       
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
              {/* <LeftMenu mode={"inline"} /> */}
              <RightMenu mode={"inline"} />
            </Drawer>
        
        </div>
        </Layout>
      </nav>
    </>
  );
};

export default Navbar;