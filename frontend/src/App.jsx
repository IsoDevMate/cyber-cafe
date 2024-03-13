import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './navbar/index';
import { About } from './components/Aboutus';
import { Contact } from "./components/contactus"
import Error from './Error';
import { SignUpForm } from './auth/signup';
import { SignIn } from './auth/signin';
import { Home } from './components/Home';
import { Checkout } from './components/checkout/checkout';

import { Services } from './components/serviceoffered/layout';
import { ProfilePage } from './components/profile/profile';
import { Queue } from './components/queue';
import { ResetPassword } from './auth/resetpasssword';
import { useAuth } from './auth/context/auth';
import { StripePaymentPage } from './components/paymentspage/stripecheckout';
import  {Success}  from '../src/components/paymentspage/success'
import  {Cancel}  from '../src/components/paymentspage/cancel'

// Create a new component for the container
const Container = ({ children }) => (
  <div className="container mx-auto px-4 py-8">{children}</div>
);

// Create a new component for the Navbar container
const NavbarContainer = () => (
  <div className="sticky top-0 z-50">
    <Navbar />
  </div>
);

function App() {
  const { user } = useAuth();
  return (
    <Router>
      <NavbarContainer />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/about" element={<About />} /> 
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/services" element={<Services />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/queue/:service" element={<Queue />} />
          <Route path="/stripe-payment" element={<StripePaymentPage />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;