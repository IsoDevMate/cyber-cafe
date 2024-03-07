import React, { useState } from "react";
import { Layout, Button, Drawer } from "antd";
import{ LeftMenu }from "./leftMenu";
import RightMenu from "./RightMenu";
import { MenuOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
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
            <div className="logo">
              <h3
                className="brand-font cursor-pointer"
                onClick={() => navigate("/")}
              >
                Your Details
              </h3>
            </div>
            <div
              className="navbar-menu"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div className="leftMenu">
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
        
        </Layout>
      </nav>
    </>
  );
};

export default Navbar;