import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth, db, collection, addDoc } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/context/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
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

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value) ? "" : "Invalid email format");
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

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(value === password ? "" : "Passwords do not match");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (
      !validateEmail(email) ||
      password.length < MIN_PASSWORD_LENGTH ||
      confirmPassword !== password
    ) {
      setErrorMessage(
        "Please enter a valid email, ensure the password is at least 8 characters long, and confirm the passwords match"
      );
      return;
    }
    try{
     createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Signed up
        console.log(userCredential.user);
        setUser(user);
        alert("User created successfully");
        navigate("/signin");

     
      })
      .catch((err) => {
        console.log("Login error:", err.message);
        setErrorMessage("Signup failed. Please try again.");
        console.log(err.code);
        alert(err.code);
      }
      )

      // Add user data to Firestore
      const usersCollection = collection(db, "users");
      await addDoc(usersCollection, {
        name,
        email: user.email,
        // Add other user data fields here
      });

      console.log("Sign up successful:", user);
      navigate("/dashboard"); 
    } catch (error) {
      console.error("Sign up error:", error);
      setErrorMessage("Sign up failed. Please try again.");
    }
  };

  

  return (
    <Card className="mx-auto w-full max-w-[24rem]">
      <CardHeader
        variant="gradient"
        color="gray"
        className="mb-4 grid h-28 place-items-center"
      >
        <Typography variant="h3" color="white">
          Sign Up
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <Typography className="mb-3 font-normal" variant="paragraph" color="gray">
          Enter your details to create a new account.
        </Typography>
        <Typography className="-mb-2" variant="h6">
          Your Name
        </Typography>
        <Input label="Full Name" size="lg" value={name} onChange={handleNameChange} />
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
          error={passwordError}
        />
        <Typography className="-mb-2" variant="h6">
          Confirm Password
        </Typography>
        <Input
          label="Confirm Password"
          size="lg"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={confirmPasswordError}
        />
        {errorMessage && (
          <Typography variant="small" color="red">
            {errorMessage}
          </Typography>
        )}
      </CardBody>
      <CardFooter className="pt-0">
        <Button variant="gradient" fullWidth onClick={handleSignUp}>
          Sign Up
        </Button>
        <Typography variant="small" className="mt-4 flex justify-center">
          Already have an account?
          <Typography
            as="a"
            href="#signin"
            variant="small"
            color="blue-gray"
            className="ml-1 font-bold"
            onClick={() => navigate("/signin")}
          >
            Sign in
          </Typography>
        </Typography>
      </CardFooter>
    </Card>
  );
};

