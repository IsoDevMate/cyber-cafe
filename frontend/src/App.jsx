import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './navbar/index';
import { About }from './components/Aboutus';
import { Contact } from "./components/contactus"
import Error from './Error';
import { SignUpForm } from './auth/signup';
import { SignIn } from './auth/signin';
import{ Home } from './components/Home';
import { Checkout } from './components/checkout/checkout';
import { LandingPage } from './components/landingpage';
import { Services } from './components/serviceoffered/layout';
import { ProfilePage } from './components/profile/profile';
import { Queue } from './components/queue';
import { ResetPassword } from './auth/resetpasssword';
import { useAuth } from './auth/context/auth';
// Create a new component for the container
const Container = ({ children }) => (
  <div className="container mx-auto px-4 py-8">{children}</div>
);

function App() {
  const { user } = useAuth();
  return (
    <Router>
      <Navbar />
      <Container>
        <Routes>
        <Route path="/" element={<Home />} />
        
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/services" element={<Services />} />
          <Route path="/profile" element={ <ProfilePage user={user} />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

