
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Navbar from './navbar/index';
import Dashboard from './components/dashboard';
import About from './components/Aboutus';
import Contact from './components/contactus';
import Navbar from './navbar/index';
import Error from './Error';
import { SignUpForm } from './auth/signup';
import { SignInForm } from './auth/signin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/Signin" element={<SignInForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;