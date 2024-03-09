
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'
import   axios  from 'axios'
import React,{ useState } from 'react'
import { AiFillInstagram, AiFillTwitterCircle } from 'react-icons/ai'
import { SiGmail } from 'react-icons/si'
export const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/subscribe", {
        email_address: email,
      });
      console.log(response.data);
      setSuccessMessage("Subscription successful");

      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error(error);

      // Check if the error is due to the member already existing
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.title === "Member Exists"
      ) {
        setErrorMessage(
          "Member already exists, please try another email"
        );
      } else {
        setErrorMessage("Subscription failed");
      }

      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };


  return (
    <>
    <footer className="footer p-10 bg-base-200 text-base-content">
  <nav>
    <h6 className="footer-title">Services</h6> 
    <a className="link link-hover">Branding</a>
    <a className="link link-hover">Design</a>
    <a className="link link-hover">Marketing</a>
    <a className="link link-hover">Advertisement</a>
  </nav> 
  <nav>
    <h6 className="footer-title">Company</h6> 
    <a className="link link-hover">About us</a>
    <a className="link link-hover">Contact</a>
    <a className="link link-hover">Jobs</a>
    <a className="link link-hover">Press kit</a>
  </nav> 
  <nav>
    <h6 className="footer-title">Legal</h6> 
    <a className="link link-hover">Terms of use</a>
    <a className="link link-hover">Privacy policy</a>
    <a className="link link-hover">Cookie policy</a>
  </nav> 
  <form>
    <h6 className="footer-title">Newsletter</h6> 
    <fieldset className="form-control w-80">
      <label className="label">
        <span className="label-text">Enter your email address</span>
      </label> 
      <div className="join">
        <input type="text" placeholder="username@site.com" className="input input-bordered join-item" /> 
        <button className="btn btn-primary join-item">Subscribe</button>
      </div>
    </fieldset>
  </form>
  <div className="flex gap-7 text-[18px] text-[#FFFFFF] min540:justify-center">
                <a href="https://www.instagram.com/">
                  <AiFillInstagram className="text-[35px] hover:text-[#4FC0D6]"/>
                </a>

                <a href="https://www.instagram.com/">
                  <AiFillTwitterCircle className="text-[35px] hover:text-[#4FC0D6]" />
                </a>
                
                <a href="https://www.instagram.com/">
                  <FaFacebook className="text-[35px] hover:text-[#4FC0D6]" />
                </a>
                
                <a href="https://www.instagram.com/">
                  <SiGmail className="text-[35px] hover:text-[#4FC0D6]" />
                </a>

              </div>
              <p className="text-[16px] font-medium text-[#FFFFFF]">
                Privacy Policy | © {new Date().getFullYear()} African Outback Safaris <br />{" "}
                All Rights Reserved
              </p>
</footer>
    </>
  )
}


