import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../src/firebase";
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../../src/auth/context/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const SignIn = () => {
 // const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const MIN_PASSWORD_LENGTH = 8;


  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };




  const handleForgotPassword = () => {
    // Add your forgot password logic here
    console.log("Forgot password clicked");
    navigate("/resetpassword");
  };



  const handlePasswordChange = (e) => {
    const value = e.target.value.trim();
    setPassword(value);
    setPasswordError(
      value.length >= MIN_PASSWORD_LENGTH
        ? ""
        : `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    );
  };



  
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value) ? "" : "Invalid email format");
  };
  

  const handleLogin = () => {
    if (!validateEmail(email) || password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(
        "Please enter a valid email and ensure the password is at least 8 characters long"
      );
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User logged in:", user);
        alert("You have  successfully loggined in as ", user);
        setUser(user);
        navigate("/home");
      })
      .catch((error) => {
        console.log("Login error:", error.message);
        setErrorMessage("Login failed: invalid credentials ");
      });
  };




  return (
    <Card className="w-30">
      <CardHeader
        variant="gradient"
        color="gray"
        className="mb-4 grid h-28 place-items-center"
      >
        <Typography variant="h3" color="white">
          Sign In
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
      <Typography className="-mb-2" variant="h6">
          Email
        </Typography>
      <Input
          label="Email"
          size="lg"
          value={email}
          onChange={handleEmailChange}
          error={emailError}
        />
        <Typography className="-mb-2" variant="h6">
          Password
        </Typography>
        <Input
          label="Password"
          size="lg"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          icon={
            showPassword ? (
              <FaEyeSlash onClick={togglePasswordVisibility} />
            ) : (
              <FaEye onClick={togglePasswordVisibility} />
            )
          }
        />
          {errorMessage && (
          <Typography variant="small" color="red">
            {errorMessage}
          </Typography>
        )}
        <div className="-ml-2.5">
          <Checkbox label="Remember Me" />
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <Button variant="gradient" onClick={handleLogin}  fullWidth>
          Sign In
        </Button>
        <Typography
          variant="small"
          color="blue-gray"
          className="mt-2 cursor-pointer"
          onClick={handleForgotPassword}
        >
          Forgot password?
        </Typography>
        <Typography variant="small" className="mt-6 flex justify-center">
          Don&apos;t have an account?
          <Link
            to="/signup"
            variant="small"
            color="blue-gray"
            className="ml-1 font-bold"
          >
            Sign up
          </Link>
        </Typography>
      </CardFooter>
    </Card>
  );
}

/*
import { ResetPassword } from './ResetPassword';
 import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  InputIcon,
} from "@material-tailwind/react";

import { sendPasswordResetEmail } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const MIN_PASSWORD_LENGTH = 8;

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordChange = (e) => {
    const value = e.target.value.trim();
    setPassword(value);
    setPasswordError(
      value.length >= MIN_PASSWORD_LENGTH
        ? ""
        : `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value) ? "" : "Invalid email format");
  };

  const handleLogin = () => {
    if (!validateEmail(email) || password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(
        "Please enter a valid email and ensure the password is at least 8 characters long"
      );
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User logged in:", user);
        setUser(user);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log("Login error:", error.message);
        setErrorMessage("Login failed: invalid credentials ");
      });
  };

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Check your inbox.");
      setError("");
    } catch (error) {
      setError(`Error sending password reset email: ${error.message}`);
      setMessage("");
    }
  };

  return (
    <Card className="w-96">
      <CardBody className="flex flex-col gap-4">
        <Typography variant="h4" color="blue-gray">
          Sign In Here 
        </Typography>
        <Typography
          className="mb-3 font-normal"
          variant="paragraph"
          color="gray"
        >
          Enter your email and password to Sign In.
        </Typography>
        <Typography className="-mb-2" variant="h6">
          Your Email
        </Typography>
        <Input
          label="Email"
          size="lg"
          value={email}
          onChange={handleEmailChange}
          error={emailError}
        />
        <Typography className="-mb-2" variant="h6">
          Your Password
        </Typography>
        <InputIcon
          type={showPassword ? "text" : "password"}
          label="Password"
          size="lg"
          value={password}
          onChange={handlePasswordChange}
          error={passwordError}
          icon={
            showPassword ? (
              <FaEyeSlash onClick={togglePasswordVisibility} />
            ) : (
              <FaEye onClick={togglePasswordVisibility} />
            )
          }
        />
        {errorMessage && (
          <Typography variant="small" color="red">
            {errorMessage}
          </Typography>
        )}
        <div className="-ml-2.5 -mt-3">
          <Checkbox label="Remember Me" />
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <Button variant="gradient" onClick={handleLogin} fullWidth>
          Sign In
        </Button>
        <Typography
          variant="small"
          color="blue-gray"
          className="mt-2 cursor-pointer"
          onClick={handleResetPassword}
        >
          Forgot password?
        </Typography>
        {message && (
          <Typography variant="small" color="green">
            {message}
          </Typography>
        )}
        {error && (
          <Typography variant="small" color="red">
            {error}
          </Typography>
        )}
      </CardFooter>
    </Card>
  );
};
 */