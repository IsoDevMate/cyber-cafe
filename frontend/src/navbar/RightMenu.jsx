import React from "react";
import { Menu, Avatar } from "antd";
import { UserOutlined, CodeOutlined, LogoutOutlined } from "@ant-design/icons";
import { SignInForm } from "../auth/signin";
import { SignUpForm } from "../auth/signup";

const RightMenu = ({ mode }) => {
  
  const handleLogout = () => {
    // Display a confirmation dialog before logging out
    if (window.confirm('Are you sure you want to log out?')) {
      signOut(auth)
        .then(() => {
          // Add any additional cleanup or redirection logic here
          navigate('/'); // Redirect to the login page after logout
        })
        .catch((error) => {
          console.error('Logout error:', error.message);
        });
    }
  };
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Menu mode={mode} style={{ display: "flex", alignItems: "center", borderRight: 0 }}>
        <Menu.Item key="signin">
          <SignInForm />
        </Menu.Item>
      </Menu>
      <Menu mode={mode} style={{ display: "flex", alignItems: "center", borderLeft: 0 }}>
        <Menu.SubMenu
          title={
            <>
              <Avatar icon={<UserOutlined />} />
              <span className="username"></span>
            </>
          }
        >
          <Menu.Item key="project">
            <CodeOutlined /> Projects
          </Menu.Item>
          <Menu.Item key="about-us">
            <UserOutlined /> Profile
          </Menu.Item>
          <Menu.Item key="log-out">
            <LogoutOutlined /> Logout
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </div>
  );
};

export default RightMenu;