import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './page/Register';
import Login from './page/Login';
import Home from './page/Home';
import Dashboard from './page/Dashboard';
import NotFound from './page/NotFound';
import UserProfile from './page/UserProfile';
import History from './page/History';
import ForgotPassword from './page/ForgetPassword';
import UpdatePassword from './page/UpdatePassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/history" element={<History />} />
        <Route path="/forgetpassword" element={<ForgotPassword />} />
        <Route path="/updatepassword" element={<UpdatePassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
