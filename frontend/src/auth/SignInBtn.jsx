import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";

export const SignInBtn = () => {

    const navigate = useNavigate();

    const handleSignIn = () => {
      navigate("/signin");
    };
  
    return <Button onClick={handleSignIn}>Sign In</Button>;
}
