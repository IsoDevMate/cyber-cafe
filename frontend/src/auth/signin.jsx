import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  InputIcon,
} from "@material-tailwind/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../src/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../src/auth/context/auth";
import { SignUpForm } from "./signup";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

export const SignInForm = () => {
  const [open, setOpen] = React.useState(false);
  const [showSignUpModal, setShowSignUpModal] = React.useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
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

    setLoading(true);

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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);

      setMessage("Password reset email sent. Check your inbox.");
      setLoading(false);
      setError("");
    } catch (error) {
      setError(`Error sending password reset email: ${error.message}`);
      setMessage("");
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen((cur) => !cur);
  const handleShowSignUpModal = () => setShowSignUpModal((prev) => !prev);

  return (
    <>
      <Button onClick={handleOpen}>Sign In</Button>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Sign In
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
            <Button
              variant="gradient"
              onClick={handleLogin}
              disabled={loading}
              fullWidth
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Sign In"}
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
            <Typography variant="small" className="mt-4 flex justify-center">
              Don&apos;t have an account?
              <Typography
                as="a"
                href="#signup"
                variant="small"
                color="blue-gray"
                className="ml-1 font-bold"
                onClick={handleShowSignUpModal}
              >
                Sign up
              </Typography>
            </Typography>
          </CardFooter>
        </Card>
      </Dialog>
      <SignUpForm open={showSignUpModal} handleOpen={handleShowSignUpModal} />
    </>
  );
};