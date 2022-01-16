import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// components
import Login from './components/Login';
// container
import Home from './container/Home';
import { fetchUser } from './utils/fetchUser';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = fetchUser();

    if (!user) {
      navigate('/login');
    }
  }, []);
  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
};

export default App;
