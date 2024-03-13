import React from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

export const LeftMenu = ({ mode }) => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    if (e.key === "explore") {
      navigate("/");
    } else if (e.key === "features") {
      navigate("/");
    } else if (e.key === "about") {
      navigate("/about");
    } else if (e.key === "contact") {
      navigate("/contact");
    }
  }
  return (
    <>
    <Menu mode={mode}>
      <Menu.Item key="explore" onClick={handleClick}>Explore</Menu.Item>
      <Menu.Item key="features" onClick={handleClick}>Features</Menu.Item>
      <Menu.Item key="about" onClick={handleClick}>About Us</Menu.Item>
      <Menu.Item key="contact"onClick={handleClick}>Contact Us</Menu.Item>
    </Menu>
    </>
  );
};

