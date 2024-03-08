import React from "react";
import { Menu, Avatar } from "antd";
import { UserOutlined, CodeOutlined, LogoutOutlined } from "@ant-design/icons";
import { SignInBtn } from "../auth/SignInBtn";
import { useAuth } from "../auth/context/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const RightMenu = ({ mode }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log("User:", user);
  }
  , [user]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      signOut(auth)
        .then(() => {
          console.log("User signed out");
          setUser(null); // Set the user state to null after successful logout
          navigate("/home", { replace: true });
        })
        .catch((error) => {
          console.error("Logout error:", error.message);
        });
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Menu mode={mode} style={{ display: "flex", alignItems: "center", borderRight: 0 }}>
        {!user && (
          <Menu.Item key="signin">
            <SignInBtn />
          </Menu.Item>
        )}
      </Menu>
      <Menu mode={mode} style={{ display: "flex", alignItems: "center", borderLeft: 0 }}>
      {user && ( // Check if user exists
        <Menu.SubMenu
         title={
        <>
          <Avatar icon={<UserOutlined />} />
          <span className="username">{user.displayName || user.email}</span> {/* Display user name or email */}
        </>
      }
       >
        <Menu.Item key="project">
            <CodeOutlined /> Projects
          </Menu.Item>
          <Menu.Item key="about-us">
            <UserOutlined /> Profile
          </Menu.Item>
          <Menu.Item key="log-out" onClick={handleLogout}>
            <LogoutOutlined /> Logout
          </Menu.Item>
        </Menu.SubMenu>
      )}
      </Menu>
    </div>
  );
};

export default RightMenu;