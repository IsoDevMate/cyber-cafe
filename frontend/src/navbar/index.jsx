import React, { useState } from "react";
import { Layout, Button, Drawer } from "antd";
import LeftMenu from "./leftMenu";
import RightMenu from "./RightMenu";
import { MenuOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
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
        <Layout>
          <Layout.Header className="nav-header">
            <div className="logo">
              <h3 className="brand-font">Your Details</h3>
            </div>
            <div className="navbar-menu" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="leftMenu">
                <LeftMenu mode={"horizontal"} />
              </div>
              <div className="rightMenu">
                <RightMenu mode={"horizontal"} />
              </div>
            </div>
            <Button className="menuButton" type="text" onClick={showDrawer} style={{ position: 'absolute', r: 10 }}>
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
              {/*<LeftMenu mode={"inline"} />*/}
              <RightMenu mode={"inline"} />
            </Drawer>
          </Layout.Header>
        </Layout>
      </nav>
    </>
  );
};

export default Navbar;